import { NextRequest, NextResponse } from "next/server";
import { searchChannels } from "@/lib/youtube";
import { ytCache } from "@/lib/youtube-cache";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const maxResults = Math.min(parseInt(searchParams.get("maxResults") || "15"), 20);

  if (!query.trim()) return NextResponse.json({ error: "Query requerida" }, { status: 400 });

  const cacheKey = req.url;
  const cached = ytCache.get<unknown>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const channels = await searchChannels(query, maxResults);
    const result = { channels };
    ytCache.set(cacheKey, result);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
