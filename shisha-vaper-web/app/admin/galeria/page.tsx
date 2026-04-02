"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, Images } from "lucide-react";
import { getContent, saveContent, genId } from "@/lib/utils";
import defaultContent from "@/data/content.json";

type ContentData = typeof defaultContent;
interface GalleryItem { id: string; url: string; alt: string; }

export default function AdminGaleria() {
  const [data, setData] = useState<ContentData | null>(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ url: "", alt: "" });

  useEffect(() => { setData(getContent()); }, []);

  function save(updated: ContentData) { setData(updated); saveContent(updated); }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!data || !form.url) return;
    const galeria: GalleryItem[] = [...(data.galeria as GalleryItem[]), { id: genId(), url: form.url, alt: form.alt }];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    save({ ...data, galeria: galeria as any });
    setForm({ url: "", alt: "" });
    setModal(false);
  }

  function handleDelete(id: string) {
    if (!data) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    save({ ...data, galeria: (data.galeria as GalleryItem[]).filter((i) => i.id !== id) as any });
  }

  if (!data) return null;
  const items = data.galeria as GalleryItem[];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[clamp(28px,5vw,42px)] text-white leading-none mb-1"
            style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}>
            GALERÍA
          </h1>
          <p className="text-sm text-[rgba(245,240,232,0.45)]">{items.length} imágenes</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#F5C01A] text-[#0D0D0D] hover:bg-[#FFD84A] transition-colors font-semibold"
          style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: "0.06em" }}>
          <Plus size={16} />
          AÑADIR IMAGEN
        </button>
      </div>

      {/* Info */}
      <div className="p-4 border border-[rgba(245,192,26,0.15)] bg-[rgba(245,192,26,0.04)] text-sm text-[rgba(245,240,232,0.55)]">
        <p>Añade imágenes mediante URL. Puedes usar Instagram CDN, Google Drive (enlace directo) o cualquier host de imágenes.</p>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[rgba(245,240,232,0.2)]">
          <Images size={48} className="mb-4 opacity-30" />
          <p className="text-sm" style={{ fontFamily: "var(--font-cinzel)" }}>No hay imágenes en la galería</p>
          <button onClick={() => setModal(true)}
            className="mt-4 text-[rgba(245,192,26,0.6)] hover:text-[#F5C01A] text-xs tracking-widest uppercase transition-colors"
            style={{ fontFamily: "var(--font-cinzel)" }}>
            + Añadir primera imagen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="relative group aspect-square bg-[#111] border border-[rgba(245,192,26,0.08)] overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt || "Galería"} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleDelete(img.id)}
                  className="p-2 bg-red-500/80 text-white hover:bg-red-500 transition-colors rounded-sm">
                  <Trash2 size={16} />
                </button>
              </div>
              {img.alt && (
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-[10px] text-[rgba(245,240,232,0.7)] truncate">{img.alt}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-[#111] border border-[rgba(245,192,26,0.2)] rounded-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl text-white" style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.06em" }}>
                  AÑADIR IMAGEN
                </h2>
                <button onClick={() => setModal(false)} className="text-[rgba(245,240,232,0.4)] hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>
                    URL de la imagen *
                  </label>
                  <input type="url" required value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-[rgba(245,192,26,0.18)] text-sm text-[rgba(245,240,232,0.8)] px-3 py-2.5 outline-none focus:border-[rgba(245,192,26,0.4)]"
                    placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>
                    Descripción / Alt
                  </label>
                  <input type="text" value={form.alt}
                    onChange={(e) => setForm({ ...form, alt: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-[rgba(245,192,26,0.18)] text-sm text-[rgba(245,240,232,0.8)] px-3 py-2.5 outline-none focus:border-[rgba(245,192,26,0.4)]"
                    placeholder="Ej: Shisha premium dorada" />
                </div>
                {form.url && (
                  <div className="aspect-video bg-[#0D0D0D] border border-[rgba(245,192,26,0.1)] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)}
                    className="flex-1 py-2.5 border border-[rgba(245,192,26,0.2)] text-[rgba(245,240,232,0.5)] hover:text-[rgba(245,240,232,0.8)] text-sm transition-colors"
                    style={{ fontFamily: "var(--font-cinzel)" }}>
                    Cancelar
                  </button>
                  <button type="submit"
                    className="flex-1 py-2.5 bg-[#F5C01A] text-[#0D0D0D] hover:bg-[#FFD84A] transition-colors"
                    style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: "0.06em" }}>
                    AÑADIR
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
