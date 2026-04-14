import { NextRequest, NextResponse } from "next/server";
import { searchVideos } from "@/lib/youtube";
import { ytCache } from "@/lib/youtube-cache";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const order = (searchParams.get("order") || "viewCount") as "viewCount" | "rating" | "relevance" | "date";
  const maxResults = parseInt(searchParams.get("maxResults") || "20");
  const publishedAfter = searchParams.get("publishedAfter") || undefined;
  const videoDuration = (searchParams.get("duration") || "any") as "short" | "medium" | "long" | "any";
  const maxSubscribers = searchParams.get("maxSubs") ? parseInt(searchParams.get("maxSubs")!) : undefined;
  const minViews = searchParams.get("minViews") ? parseInt(searchParams.get("minViews")!) : undefined;
  const channelId = searchParams.get("channelId") || undefined;

  if (!query.trim()) return NextResponse.json({ error: "Query requerida" }, { status: 400 });

  const cacheKey = req.url;
  const cached = ytCache.get<unknown>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const videos = await searchVideos(query, { order, maxResults, publishedAfter, videoDuration, maxSubscribers, minViews, channelId });
    const result = { videos };
    ytCache.set(cacheKey, result);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
