'use client';
import { motion } from 'framer-motion';
import type { Breakdown } from '@/lib/planner/types';
import { spring } from '@/lib/tokens';

const ROWS: { key: keyof Breakdown; label: string }[] = [
  { key: 'stay', label: 'Жильё' },
  { key: 'food', label: 'Еда' },
  { key: 'activities', label: 'Впечатления' },
  { key: 'transport', label: 'Переезды' },
  { key: 'buffer', label: 'Запас' },
];

export function BudgetBreakdown({ total, breakdown }: { total: number; breakdown: Breakdown }) {
  const max = Math.max(...Object.values(breakdown).map((v) => Math.abs(v)), 1);
  const over = breakdown.buffer < 0;

  return (
    <section aria-labelledby="budget-title" className="glass rounded-card p-6">
      <div className="flex items-baseline justify-between">
        <h4 id="budget-title" className="font-medium">Бюджет</h4>
        <span className="text-sm tabular-nums text-muted">{total.toLocaleString('ru-RU')} €</span>
      </div>
      <ul className="mt-5 space-y-4">
        {ROWS.map((r, i) => {
          const v = breakdown[r.key];
          return (
            <li key={r.key}>
              <div className="flex justify-between text-sm">
                <span className="text-muted">{r.label}</span>
                <span className={`tabular-nums ${v < 0 ? 'text-red-300' : ''}`}>{v.toLocaleString('ru-RU')} €</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[.06]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent3"
                  initial={{ width: 0 }}
                  animate={{ width: `${(Math.abs(v) / max) * 100}%` }}
                  transition={{ ...spring.soft, delay: i * 0.06 }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      {over && (
        <p role="status" className="mt-5 text-sm text-red-300">
          Смета выходит за бюджет. Уменьшите ночлег или выберите альтернативу.
        </p>
      )}
    </section>
  );
}
