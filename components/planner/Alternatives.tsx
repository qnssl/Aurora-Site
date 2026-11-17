'use client';
import type { Alternative } from '@/lib/planner/types';

export function Alternatives({
  items,
  onPick,
  disabled,
}: {
  items: Alternative[];
  onPick: (budget: number) => void;
  disabled?: boolean;
}) {
  return (
    <section aria-labelledby="alt-title" className="glass rounded-card p-6">
      <h4 id="alt-title" className="font-medium">Альтернативы</h4>
      <ul className="mt-5 space-y-3">
        {items.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPick(a.budgetEur)}
              className="w-full rounded-2xl border border-line/10 bg-white/[.03] p-4 text-left transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/[.06] disabled:opacity-50"
            >
              <div className="flex justify-between gap-4">
                <span className="font-medium">{a.title}</span>
                <span className="text-sm tabular-nums text-muted">{a.budgetEur.toLocaleString('ru-RU')} €</span>
              </div>
              <p className="mt-1 text-sm text-muted">{a.summary}</p>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
