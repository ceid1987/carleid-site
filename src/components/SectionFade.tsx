"use client";

import React, { useEffect, useRef } from 'react';

interface SectionFadeProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Scroll-linked section transition: content is crisp while its section is
 * centered in the viewport, and gradually shrinks, blurs and fades as it
 * scrolls away (in either direction). The incoming section runs the same
 * curve in reverse, so sections cross-fade as you move between them.
 */
const SectionFade: React.FC<SectionFadeProps> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      // 0 when the element is centered in the viewport, 1 when fully off-screen.
      const p = Math.min(Math.abs(center - vh / 2) / ((rect.height + vh) / 2), 1);
      // Wide dead zone: the outgoing section stays crisp well past center and
      // the incoming one sharpens well before reaching it — the blur ramps up
      // only over the last stretch of the hand-off.
      const t = Math.max(0, (p - 0.35) / 0.65);

      if (t === 0) {
        // Fully reset so no transform/filter lingers — a transformed ancestor
        // would otherwise capture position:fixed descendants (e.g. modals).
        el.style.transform = '';
        el.style.filter = '';
        el.style.opacity = '';
        return;
      }

      el.style.transform = `scale(${1 - 0.2 * t})`;
      el.style.filter = `blur(${(10 * t).toFixed(2)}px)`;
      el.style.opacity = `${1 - 0.85 * t}`;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default SectionFade;
