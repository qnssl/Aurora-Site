'use client';
import { useEffect, useRef } from 'react';

const SPACING = 26;
const CITIES: [number, number][] = [[0.14, 0.64], [0.48, 0.34], [0.84, 0.66]];

export function RouteField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -9999, y: -9999 };
    const size = { w: 0, h: 0 };
    const start = performance.now();
    let raf = 0;

    const resize = () => {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.w = r.width;
      size.h = r.height;
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const { w, h } = size;
      const t = reduce ? 0 : (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      for (let x = SPACING / 2; x < w; x += SPACING) {
        for (let y = SPACING / 2; y < h; y += SPACING) {
          const near = Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 170);
          ctx.beginPath();
          ctx.fillStyle = near > 0.02
            ? `rgba(124, 245, 208, ${0.15 + near * 0.75})`
            : 'rgba(255, 255, 255, 0.12)';
          ctx.arc(x, y, 0.9 + near * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const pts = CITIES.map(([fx, fy]) => ({ x: fx * w, y: fy * h }));
      ctx.setLineDash([2, 9]);
      ctx.lineDashOffset = -t * 14;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(197, 139, 255, 0.7)';
      ctx.beginPath();
      pts.forEach((p, i) => {
        if (i === 0) {
          ctx.moveTo(p.x, p.y);
          return;
        }
        const prev = pts[i - 1];
        const mx = (prev.x + p.x) / 2;
        const my = (prev.y + p.y) / 2 - Math.hypot(p.x - prev.x, p.y - prev.y) * 0.22;
        ctx.quadraticCurveTo(mx, my, p.x, p.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      pts.forEach((p, i) => {
        const pulse = (Math.sin(t * 2 + i * 1.7) + 1) / 2;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(245, 245, 247, ${0.15 + pulse * 0.25})`;
        ctx.lineWidth = 1;
        ctx.arc(p.x, p.y, 6 + pulse * 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = '#F5F5F7';
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const frame = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(frame);
    };
    const run = () => {
      if (!reduce && !raf) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };

    resize();
    draw(performance.now());

    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) run();
      else stop();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(performance.now());
    });
    ro.observe(host);

    if (!reduce) window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="block" />;
}
