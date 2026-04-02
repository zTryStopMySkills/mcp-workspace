"use client";
import { useState, useRef, useCallback, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, animate } from "framer-motion";
import { Tag, Package, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import content from "@/data/content.json";
import { formatPrice } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import SkeletonCard from "@/components/ui/SkeletonCard";

gsap.registerPlugin(ScrollTrigger);

const ProductViewer3D = lazy(() => import("@/components/ProductViewer3D"));

/* ─── Product Modal (FLIP destination) ──────────────────────────────────── */
function ProductModal({
  product,
  whatsappBase,
  onClose,
}: {
  product: typeof content.productos[0];
  whatsappBase: string | null;
  onClose: () => void;
}) {
  const categoria = content.categorias.find((c) => c.id === product.categoria);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0D0D0D]/85 backdrop-blur-sm" />

      <motion.div
        className="relative z-10 w-full max-w-2xl bg-[#111] border border-[rgba(245,192,26,0.2)] overflow-hidden"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-[rgba(245,240,232,0.4)] hover:text-[#F5C01A] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col sm:flex-row">
          {/* FLIP image — same layoutId as card image */}
          <motion.div
            layoutId={`product-img-${product.id}`}
            className="relative bg-[#0A0A0A] flex-shrink-0 sm:w-64 h-56 sm:h-auto"
          >
            {product.imagen ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imagen}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={48} className="text-[rgba(245,192,26,0.15)]" />
              </div>
            )}
          </motion.div>

          {/* Info */}
          <div className="p-8 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Tag size={11} className="text-[#F5C01A]" />
                <span className="text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-cinzel)" }}>
                  {categoria?.nombre}
                </span>
              </div>
              <h3
                className="text-4xl text-white mb-3"
                style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}
              >
                {product.nombre}
              </h3>
              <p className="text-sm text-[rgba(245,240,232,0.5)] leading-relaxed mb-6">
                {product.descripcion}
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl text-[#F5C01A]"
                  style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}>
                  {formatPrice(product.precio)}
                </span>
                {product.precio_antes && (
                  <span className="text-sm text-[rgba(245,240,232,0.3)] line-through">
                    {formatPrice(product.precio_antes)}
                  </span>
                )}
              </div>

              <MagneticButton>
                {whatsappBase ? (
                  <a
                    href={`${whatsappBase}?text=${encodeURIComponent(`Hola! Me interesa el producto "${product.nombre}". ¿Está disponible?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-8 py-3 bg-[#F5C01A] text-[#0D0D0D] text-sm tracking-widest uppercase font-bold hover:bg-[#FFD84A] transition-colors text-center"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    Pedir por WhatsApp
                  </a>
                ) : (
                  <a
                    href="#contacto"
                    onClick={onClose}
                    className="block px-8 py-3 border border-[rgba(245,192,26,0.5)] text-[#F5C01A] text-sm tracking-widest uppercase hover:bg-[rgba(245,192,26,0.08)] transition-colors text-center"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    Consultar
                  </a>
                )}
              </MagneticButton>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── 3D Product Card ───────────────────────────────────────────────────── */
function ProductCard({ product, index, whatsappBase }: {
  product: typeof content.productos[0];
  index: number;
  whatsappBase: string | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [show3D, setShow3D] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Desktop mouse tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });
  const dragX = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const categoria = content.categorias.find((c) => c.id === product.categoria);

  return (
    <>
      <motion.div
        style={{ perspective: 1000 }}
        className="relative product-card"
        /* No initial/animate here — GSAP stagger handles entrance */
      >
        <motion.div
          ref={cardRef}
          className="group card-base rounded-sm overflow-hidden flex flex-col cursor-pointer select-none"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          drag="x"
          dragElastic={0.15}
          dragConstraints={{ left: -120, right: 120 }}
          onDrag={(_e, info) => {
            dragX.set(info.offset.x);
            if (window.innerWidth < 768) mouseX.set(info.offset.x / 240);
          }}
          onDragEnd={() => {
            dragX.set(0);
            animate(dragX, 0, { type: "spring", stiffness: 300, damping: 30 });
            mouseX.set(0);
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => !show3D && setModalOpen(true)}
        >
          {/* Shine overlay */}
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none rounded-sm"
            style={{
              background: useTransform(
                [mouseX, mouseY],
                ([mx, my]) =>
                  `radial-gradient(circle at ${50 + (mx as number) * 80}% ${50 + (my as number) * 80}%, rgba(245,192,26,0.07) 0%, transparent 60%)`
              ),
            }}
          />

          {/* Product image / 3D viewer — FLIP source */}
          <div
            className="relative bg-[#0A0A0A] overflow-hidden flex-shrink-0"
            style={{ height: show3D ? "280px" : undefined, aspectRatio: show3D ? undefined : "4/3" }}
          >
            {show3D ? (
              <Suspense fallback={<SkeletonCard className="h-full w-full border-0 rounded-none p-0" />}>
                <ProductViewer3D
                  type={["shishas", "mazas", "accesorios"].includes(product.categoria) ? "shisha" : "vaper"}
                  className="w-full h-full"
                />
              </Suspense>
            ) : (
              /* FLIP source image */
              <motion.div layoutId={`product-img-${product.id}`} className="w-full h-full">
                {product.imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    draggable={false}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: "radial-gradient(circle at 50% 50%, rgba(245,192,26,0.08) 0%, transparent 70%)" }}
                  >
                    <Package size={64} className="text-[rgba(245,192,26,0.15)]" />
                  </div>
                )}
              </motion.div>
            )}

            {/* Toggle 3D button */}
            <button
              onClick={(e) => { e.stopPropagation(); setShow3D((v) => !v); }}
              className={`absolute top-3 right-3 z-20 px-2.5 py-1 text-[9px] tracking-widest uppercase transition-all ${
                show3D
                  ? "bg-[#F5C01A] text-[#0D0D0D] font-bold"
                  : "bg-[rgba(13,13,13,0.75)] border border-[rgba(245,192,26,0.35)] text-[rgba(245,192,26,0.8)] hover:border-[rgba(245,192,26,0.7)]"
              }`}
              style={{ fontFamily: "var(--font-cinzel)", backdropFilter: "blur(4px)" }}
            >
              {show3D ? "← Foto" : "3D ↺"}
            </button>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2 z-10">
              {product.destacado && (
                <span className="px-2.5 py-1 bg-[#F5C01A] text-[#0D0D0D] text-[10px] font-bold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-cinzel)" }}>
                  Destacado
                </span>
              )}
              {product.precio_antes && (
                <span className="px-2.5 py-1 bg-red-600/80 text-white text-[10px] font-bold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-cinzel)" }}>
                  Oferta
                </span>
              )}
            </div>

            {product.stock <= 3 && product.stock > 0 && (
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#0D0D0D]/80 text-[#F5C01A] text-[10px] tracking-widest uppercase z-10"
                style={{ fontFamily: "var(--font-cinzel)" }}>
                Últimas unidades
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-[#0D0D0D]/60 flex items-center justify-center z-10">
                <span className="text-[rgba(245,240,232,0.5)] text-sm tracking-widest uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                  Agotado
                </span>
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="p-5 flex flex-col flex-1 bg-[#0D0D0D]">
            <div className="flex items-center gap-1.5 mb-2">
              <Tag size={11} className="text-[#F5C01A]" />
              <span className="text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}>
                {categoria?.nombre}
              </span>
            </div>
            <h3 className="text-lg text-white mb-1.5 group-hover:text-[#F5C01A] transition-colors"
              style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}>
              {product.nombre}
            </h3>
            <p className="text-xs text-[rgba(245,240,232,0.45)] leading-relaxed mb-4 flex-1">
              {product.descripcion}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <div>
                <span className="text-2xl text-[#F5C01A]"
                  style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}>
                  {formatPrice(product.precio)}
                </span>
                {product.precio_antes && (
                  <span className="ml-2 text-sm text-[rgba(245,240,232,0.3)] line-through">
                    {formatPrice(product.precio_antes)}
                  </span>
                )}
              </div>

              {/* Magnetic CTA button */}
              <MagneticButton radius={60} intensity={0.3}>
                {whatsappBase ? (
                  <a
                    href={`${whatsappBase}?text=${encodeURIComponent(`Hola! Me interesa el producto "${product.nombre}". ¿Está disponible?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 bg-[rgba(245,192,26,0.1)] border border-[rgba(245,192,26,0.25)] text-[#F5C01A] text-xs tracking-widest uppercase hover:bg-[rgba(245,192,26,0.2)] transition-all"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    Pedir
                  </a>
                ) : (
                  <a
                    href="#contacto"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 bg-[rgba(245,192,26,0.1)] border border-[rgba(245,192,26,0.25)] text-[#F5C01A] text-xs tracking-widest uppercase hover:bg-[rgba(245,192,26,0.2)] transition-all"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    Consultar
                  </a>
                )}
              </MagneticButton>
            </div>
          </div>

          <motion.div
            className="h-0.5 bg-[#F5C01A] origin-left"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      </motion.div>

      {/* FLIP Modal */}
      <AnimatePresence>
        {modalOpen && (
          <ProductModal
            product={product}
            whatsappBase={whatsappBase}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Products Section ───────────────────────────────────────────────────── */
export default function Products() {
  const [activeCategory, setActiveCategory] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);
  const allCats = [{ id: "all", nombre: "Todo" }, ...content.categorias];
  const activeProducts = content.productos.filter(
    (p) => p.activo && (activeCategory === "all" || p.categoria === activeCategory)
  );

  const whatsappBase = content.negocio.whatsapp
    ? `https://wa.me/${content.negocio.whatsapp.replace(/\D/g, "")}`
    : null;

  // GSAP stagger on category change
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".product-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: "power2.out",
        clearProps: "transform",
      }
    );
  }, [activeCategory]);

  // GSAP scroll-triggered stagger on first load
  useEffect(() => {
    if (!gridRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: gridRef.current,
      start: "top 80%",
      onEnter: () => {
        const cards = gridRef.current?.querySelectorAll(".product-card");
        if (!cards) return;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out", clearProps: "transform" }
        );
      },
      once: true,
    });
    return () => trigger.kill();
  }, []);

  return (
    <section id="productos" className="py-28 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--grad-section)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 justify-center mb-4"
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#F5C01A]" />
            <span className="text-[11px] tracking-[0.4em] text-[#F5C01A] uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}>
              Selección Premium
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#F5C01A]" />
          </motion.div>
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-[clamp(40px,7vw,72px)] leading-none text-white mb-4"
            style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.03em" }}
          >
            NUESTROS <span style={{ color: "#F5C01A" }}>PRODUCTOS</span>
          </motion.h2>
          <p className="text-[rgba(245,240,232,0.55)] max-w-lg mx-auto">
            Una selección cuidadosamente elegida de los mejores productos del mundo de la shisha y el vapeo.
          </p>
        </div>

        {/* Category filter — magnetic buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {allCats.map((cat) => (
            <MagneticButton key={cat.id} radius={50} intensity={0.25}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 text-sm transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#F5C01A] text-[#0D0D0D] font-semibold"
                    : "border border-[rgba(245,192,26,0.25)] text-[rgba(245,240,232,0.6)] hover:border-[rgba(245,192,26,0.6)] hover:text-[#F5C01A]"
                }`}
                style={{ fontFamily: "var(--font-cinzel)", letterSpacing: "0.06em" }}
              >
                {cat.nombre}
              </motion.button>
            </MagneticButton>
          ))}
        </div>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            ref={gridRef}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeProducts.length === 0 ? (
              <div className="col-span-3 text-center py-20 text-[rgba(245,240,232,0.3)]">
                <Package size={40} className="mx-auto mb-4 opacity-30" />
                <p style={{ fontFamily: "var(--font-cinzel)" }}>Próximamente más productos en esta categoría</p>
              </div>
            ) : (
              activeProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  whatsappBase={whatsappBase}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 border border-[rgba(245,192,26,0.2)] bg-[rgba(245,192,26,0.04)] text-center"
        >
          <p className="text-[rgba(245,240,232,0.6)] mb-3 text-sm">
            ¿No encuentras lo que buscas? Tenemos mucho más en tienda.
          </p>
          <MagneticButton>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 text-[#F5C01A] hover:text-[#FFD84A] transition-colors text-sm tracking-widest uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Contáctanos <span>→</span>
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
