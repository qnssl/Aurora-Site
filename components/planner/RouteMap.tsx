'use client';
import { useEffect } from 'react';
import { animate, motion, useMotionValue, type MotionValue } from 'framer-motion';
import type { Stop } from '@/lib/planner/types';

const W = 600;
const H = 420;
const P = 56;

export function project(points: { lat: number; lng: number }[]) {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const rLat = Math.max(maxLat - minLat, 0.01);
  const rLng = Math.max(maxLng - minLng, 0.01);
  return points.map((p) => ({
    x: P + ((p.lng - minLng) / rLng) * (W - 2 * P),
    y: P + ((maxLat - p.lat) / rLat) * (H - 2 * P),
  }));
}

export function RouteMap({ stops, progress }: { stops: Stop[]; progress?: MotionValue<number> }) {
  const pts = project(stops);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  // Без внешнего progress линия рисуется один раз при появлении.
  const own = useMotionValue(0);
  useEffect(() => {
    if (progress) return;
    const controls = animate(own, 1, { duration: 1.2, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [progress, own]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Маршрут: ${stops.map((s) => s.name).join(', ')}`} className="h-auto w-full">
      <defs>
        <linearGradient id="route-grad" x1="0" x2="1">
          <stop offset="0" style={{ stopColor: 'rgb(var(--accent-rgb))' }} />
          <stop offset="1" style={{ stopColor: 'rgb(var(--accent-3-rgb))' }} />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth={10} strokeLinecap="round" />
      <motion.path
        d={d}
        fill="none"
        stroke="url(#route-grad)"
        strokeWidth={3}
        strokeLinecap="round"
        style={{ pathLength: progress ?? own }}
      />
      {pts.map((p, i) => (
        <g key={`${stops[i].name}-${i}`}>
          <circle cx={p.x} cy={p.y} r={6} style={{ fill: 'rgb(var(--fg-rgb))' }} />
          <text x={p.x + 12} y={p.y + 4} fontSize="13" style={{ fill: 'rgb(var(--muted-rgb))' }}>
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
