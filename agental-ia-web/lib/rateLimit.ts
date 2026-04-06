/**
 * Rate limiter con soporte para Upstash Redis (producción) y fallback in-memory (desarrollo).
 *
 * Para activar Redis en producción, añade a .env.local:
 *   UPSTASH_REDIS_REST_URL=https://...upstash.io
 *   UPSTASH_REDIS_REST_TOKEN=...
 *
 * Sin esas variables usa in-memory (válido para instancia única / desarrollo local).
 */

interface RateLimitOptions {
  key: string;
  limit: number;
  windowSec: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/* ─── In-memory fallback ─── */

interface MemEntry { count: number; resetAt: number; }
const store = new Map<string, MemEntry>();

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, e] of store.entries()) {
      if (e.resetAt < now) store.delete(k);
    }
  }, 5 * 60 * 1000);
}

function memRateLimit({ key, limit, windowSec }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    const newEntry: MemEntry = { count: 1, resetAt: now + windowMs };
    store.set(key, newEntry);
    return { allowed: true, remaining: limit - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/* ─── Upstash Redis rate limiter ─── */

// Lazy-initialized Upstash limiter (only when env vars present)
let upstashLimiter: ((key: string, limit: number, windowSec: number) => Promise<RateLimitResult>) | null = null;

async function getUpstashLimiter() {
  if (upstashLimiter) return upstashLimiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const { Redis } = await import("@upstash/redis");
  const { Ratelimit } = await import("@upstash/ratelimit");

  const redis = new Redis({ url, token });

  upstashLimiter = async (key: string, limit: number, windowSec: number): Promise<RateLimitResult> => {
    const rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
      prefix: "agental:rl",
    });

    const { success, remaining, reset } = await rl.limit(key);
    return { allowed: success, remaining, resetAt: reset };
  };

  return upstashLimiter;
}

/* ─── Public API ─── */

export async function rateLimitAsync(opts: RateLimitOptions): Promise<RateLimitResult> {
  const limiter = await getUpstashLimiter();
  if (limiter) {
    return limiter(opts.key, opts.limit, opts.windowSec);
  }
  return memRateLimit(opts);
}

/**
 * Sync version (in-memory only). Kept for backwards compatibility.
 * Prefer `rateLimitAsync` in new code.
 */
export function rateLimit(opts: RateLimitOptions): RateLimitResult {
  return memRateLimit(opts);
}
