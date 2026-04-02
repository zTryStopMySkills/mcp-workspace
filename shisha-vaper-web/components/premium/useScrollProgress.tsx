"use client";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Returns a scroll progress value (0→1) for a given ref.
 * start: when the top of the element hits the bottom of the viewport
 * end: when the bottom of the element hits the top of the viewport
 */
export function useScrollProgress(
  ref: React.RefObject<HTMLElement | null>,
  options?: { start?: string; end?: string }
) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: options?.start ?? "top bottom",
      end: options?.end ?? "bottom top",
      scrub: true,
      onUpdate: (self) => setProgress(self.progress),
    });

    return () => trigger.kill();
  }, [ref, options?.start, options?.end]);

  return progress;
}

/**
 * Returns a raw 0→1 progress for the entire page scroll.
 */
export function usePageScrollProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? doc.scrollTop / total : 0);
      rafRef.current = requestAnimationFrame(update);
    }
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return progress;
}
