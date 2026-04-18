// bot/services/nexus/http-client.js
// Authenticated fetch with 3-retry exponential backoff for calling
// internal Nexus services (Cortesia, SonarForge).
import config from '../../config.js';

const RETRY_DELAYS = [1000, 2000, 4000];

/**
 * POST JSON to a Nexus internal endpoint with retries.
 *
 * @param {string} url
 * @param {object} body - will be JSON-serialised
 * @returns {Promise<object>} parsed JSON response
 * @throws {Error} with .detail object if all retries fail
 */
export async function nexusFetch(url, body) {
  let lastError;

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-nexus-secret': config.nexusInternalSecret,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '(no body)');
        throw new Error(`HTTP ${res.status} from ${url}: ${text}`);
      }

      return await res.json();
    } catch (err) {
      lastError = err;

      if (attempt < RETRY_DELAYS.length) {
        console.warn(
          `[nexus-http] attempt ${attempt + 1} failed, retrying in ${RETRY_DELAYS[attempt]}ms:`,
          err.message,
        );
        await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt]));
      }
    }
  }

  const detail = {
    url,
    attempts: RETRY_DELAYS.length + 1,
    message: lastError?.message,
    stack: lastError?.stack,
  };
  const error = new Error(`nexusFetch failed after all retries: ${lastError?.message}`);
  error.detail = detail;
  throw error;
}
