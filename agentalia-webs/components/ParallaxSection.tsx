"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}

export default function ParallaxSection({ children, className = "", depth = 0.15 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${depth * 100}px`, `-${depth * 100}px`]);
  const rotateX = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [3, 0, 0, -3]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, rotateX, transformPerspective: 1200 }} className="w-full">
        {children}
      </motion.div>
    </div>
  );
}
