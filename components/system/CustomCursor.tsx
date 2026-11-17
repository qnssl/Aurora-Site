'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { spring } from '@/lib/tokens';

const ON_DARK = '#7CF5D0';
const ON_LIGHT = '#4F3BD8';

function backgroundLuminance(el: Element | null): number {
  let node: Element | null = el;
  while (node) {
    const m = getComputedStyle(node).backgroundColor.match(
      /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/,
    );
    if (m && (m[4] === undefined || Number(m[4]) > 0.5)) {
      const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    }
    node = node.parentElement;
  }
  return 0;
}

const INTERACTIVE = 'a, button, summary, label, input, select, textarea';

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 700, damping: 40, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 700, damping: 40, mass: 0.35 });
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    let raf = 0;
    let lastX = 0;
    let lastY = 0;

    const paint = () => {
      raf = 0;
      const el = document.elementFromPoint(lastX, lastY);
      const onLight = backgroundLuminance(el) > 0.5;
      if (dotRef.current) dotRef.current.style.backgroundColor = onLight ? ON_LIGHT : ON_DARK;
    };

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      setHover(!!t?.closest(INTERACTIVE));
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] size-2.5 rounded-full bg-accent transition-[background-color] duration-300 ease-out"
      style={{ x: sx, y: sy, marginLeft: -5, marginTop: -5 }}
      animate={{ scale: hover ? 2.6 : 1 }}
      transition={spring.snappy}
    />
  );
}
