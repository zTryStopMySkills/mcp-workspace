"use client";
import { motion } from "framer-motion";
import { Images } from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import content from "@/data/content.json";

export default function Gallery() {
  const hasImages = content.galeria.length > 0;

  return (
    <section id="galeria" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 justify-center mb-4"
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#F5C01A]" />
            <span
              className="text-[11px] tracking-[0.4em] text-[#F5C01A] uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Síguenos
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#F5C01A]" />
          </motion.div>
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 75, damping: 16 }}
            className="text-[clamp(40px,7vw,72px)] leading-none text-white"
            style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.03em" }}
          >
            NUESTRA <span style={{ color: "#F5C01A" }}>GALERÍA</span>
          </motion.h2>
        </div>

        {hasImages ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(content.galeria as { url: string; alt?: string }[]).map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ type: "spring", stiffness: 80, damping: 18, delay: (i % 8) * 0.08 }}
                className={`group relative overflow-hidden bg-[#111] border border-[rgba(245,192,26,0.06)] ${
                  i === 0 ? "col-span-2 row-span-2" : ""
                }`}
                style={{ aspectRatio: "1/1" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || `Galería ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-[10px] text-[rgba(245,240,232,0.7)] tracking-widest uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {img.alt}
                  </span>
                </div>
                {/* Gold corner accent on hover */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#F5C01A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#F5C01A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        ) : (
          /* Placeholder when no gallery images */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden"
          >
            {/* Placeholder grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`relative bg-[#111] border border-[rgba(245,192,26,0.08)] flex items-center justify-center ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
                  whileHover={{ borderColor: "rgba(245,192,26,0.25)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-center p-4 w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo-oficial.jpg"
                      alt="Shisha Vaper Sevilla"
                      className={`object-contain opacity-30 ${i === 0 ? "max-w-[200px]" : "max-w-[100px]"}`}
                    />
                  </div>
                  {/* Animated shimmer */}
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(90deg, transparent 0%, rgba(245,192,26,0.03) 50%, transparent 100%)" }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href={content.config.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3 border border-[rgba(245,192,26,0.3)] text-[#F5C01A] hover:bg-[rgba(245,192,26,0.06)] hover:border-[rgba(245,192,26,0.6)] transition-all"
            style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", letterSpacing: "0.06em" }}
          >
            <InstagramIcon size={18} />
            SÍGUENOS EN INSTAGRAM
          </a>
        </motion.div>
      </div>
    </section>
  );
}
