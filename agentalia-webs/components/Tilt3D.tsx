"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  perspective?: number;
  scale?: number;
  glare?: boolean;
  glareColor?: string;
  rounded?: string; // pass border-radius class e.g. "rounded-2xl"
}

export default function Tilt3D({
  children,
  className = "",
  intensity = 10,
  perspective = 900,
  scale = 1.03,
  glare = true,
  glareColor = "rgba(255,255,255,0.10)",
  rounded = "rounded-2xl",
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-1, 1], [intensity, -intensity]), { stiffness: 200, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-1, 1], [-intensity, intensity]), { stiffness: 200, damping: 22 });
  const scaleVal = useSpring(1, { stiffness: 300, damping: 25 });

  // Glare — only visible on hover
  const glareOpacity = useSpring(0, { stiffness: 300, damping: 30 });
  const glareX = useTransform(x, [-1, 1], [0, 100]);
  const glareY = useTransform(y, [-1, 1], [0, 100]);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    y.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    scaleVal.set(scale);
    glareOpacity.set(1);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
    scaleVal.set(1);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, scale: scaleVal, transformPerspective: perspective }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative ${rounded} ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          style={{
            opacity: glareOpacity,
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, ${glareColor} 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
          className={`absolute inset-0 ${rounded} z-20`}
        />
      )}
    </motion.div>
  );
}
