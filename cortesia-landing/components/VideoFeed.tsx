import Image from "next/image";
import { Play, Clock } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail_url: string;
  channel_title: string;
  published_at: string;
  video_id: string;
  duration?: string;
}

async function getVideos(): Promise<Video[]> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const res = await fetch(
      `${url}/rest/v1/cortesia_videos?select=id,title,thumbnail_url,channel_title,published_at,video_id&order=published_at.desc&limit=6`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: 3600 }
      }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "hoy";
  if (days === 1) return "ayer";
  if (days < 7) return `hace ${days} días`;
  if (days < 30) return `hace ${Math.floor(days / 7)} sem`;
  return `hace ${Math.floor(days / 30)} meses`;
}

export async function VideoFeed() {
  const videos = await getVideos();
  if (videos.length === 0) return null;

  return (
    <section id="videos" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-red-400 uppercase tracking-widest mb-3">YouTube</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contenido gratuito cada semana
          </h2>
          <p className="text-[#8B95A9] text-lg max-w-xl mx-auto">
            Estrategias reales de IA comercial, sin filtros ni relleno.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((v) => (
            <a
              key={v.id}
              href={`https://youtube.com/watch?v=${v.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 transition-all hover:-translate-y-0.5"
            >
              <div className="relative aspect-video bg-black/40">
                {v.thumbnail_url && (
                  <Image
                    src={v.thumbnail_url}
                    alt={v.title}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                    <Play size={18} className="text-white ml-0.5" fill="white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-white line-clamp-2 mb-2 group-hover:text-[#7DD3FC] transition-colors">
                  {v.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#8B95A9]">
                  <Clock size={10} />
                  {timeAgo(v.published_at)}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://youtube.com/@CortesIA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
          >
            Ver todos los vídeos en YouTube →
          </a>
        </div>
      </div>
    </section>
  );
}
