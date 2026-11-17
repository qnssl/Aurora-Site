'use client';
import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import type { TripPlan } from '@/lib/planner/types';
import { RouteMap } from '@/components/planner/RouteMap';
import { spring } from '@/lib/tokens';

export function StoryDays({ plan, isSample }: { plan: TripPlan; isSample: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const n = plan.days.length;
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(n - 1, Math.floor(v * n))));

  const dayProgress = useTransform(scrollYProgress, (v) => (v >= 1 ? 1 : (v * n) % 1));
  const day = plan.days[active];

  return (
    <section
      ref={ref}
      id="story"
      aria-labelledby="story-title"
      style={{ height: `${n * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
          <div>
            <p className="text-sm tabular-nums text-muted">
              {isSample ? 'Пример маршрута · ' : ''}День {active + 1} из {n}
            </p>
            <h2 id="story-title" className="sr-only">История поездки по дням</h2>
            <div className="mt-2 h-px w-full bg-white/10">
              <motion.div className="h-px origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={day.index}
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                transition={spring.soft}
              >
                <h3 className="text-display mt-8 text-4xl md:text-6xl">{day.title}</h3>
                <p className="mt-3 text-muted">
                  {new Date(day.date).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <ol className="mt-8 space-y-5">
                  {day.stops.map((s) => (
                    <li key={`${s.name}-${s.time}`} className="flex gap-4">
                      <span className="w-12 shrink-0 text-sm tabular-nums text-muted">{s.time}</span>
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="mt-1 text-sm text-muted">{s.note}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="glass hidden rounded-card p-6 md:block">
            <RouteMap stops={day.stops} progress={dayProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}
