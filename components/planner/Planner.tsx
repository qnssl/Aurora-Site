'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePlan, type PlanState } from '@/lib/planner/store';
import { CITIES } from '@/lib/planner/catalog';
import { VIBES, type CityId, type PlanInput, type Vibe } from '@/lib/planner/types';
import { addDays, BUDGET_RANGE, dayCount } from '@/lib/planner/validate';
import { spring } from '@/lib/tokens';
import { RouteMap } from './RouteMap';
import { BudgetBreakdown } from './BudgetBreakdown';
import { Alternatives } from './Alternatives';

const VIBE_LABEL: Record<Vibe, string> = {
  culture: 'Культура', food: 'Гастрономия', nature: 'Природа',
  nightlife: 'Ночная жизнь', slow: 'Не спешить', adventure: 'Приключение',
};

const STAGES = ['Читаю бюджет и даты', 'Подбираю районы', 'Строю маршрут по дням', 'Считаю смету и альтернативы'];

const inputCls =
  'w-full rounded-xl border border-line/10 bg-white/[.04] px-4 py-3 text-fg outline-none transition duration-200 ' +
  'focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/40 aria-[invalid=true]:border-red-400/60';

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm text-muted">{label}</label>
      {children}
      {error && <p id={`${id}-error`} role="alert" className="text-sm text-red-300">{error}</p>}
    </div>
  );
}

export function Planner() {
  const { state, submit, reset } = usePlan();
  const [form, setForm] = useState<PlanInput>({ city: 'lisbon', budget: 1800, startDate: '', endDate: '', vibes: ['culture', 'food'] });

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    const start = d.toISOString().slice(0, 10);
    setForm((f) => ({ ...f, startDate: start, endDate: addDays(start, 3) }));
  }, []);

  const errors = state.status === 'invalid' ? state.errors : {};
  const loading = state.status === 'loading';
  const update = <K extends keyof PlanInput>(k: K, v: PlanInput[K]) => setForm((f) => ({ ...f, [k]: v }));
  const toggleVibe = (v: Vibe) =>
    setForm((f) => ({
      ...f,
      vibes: f.vibes.includes(v) ? f.vibes.filter((x) => x !== v) : f.vibes.length < 3 ? [...f.vibes, v] : f.vibes,
    }));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
      <form
        noValidate
        aria-labelledby="planner-form-title"
        onSubmit={(e) => { e.preventDefault(); submit(form); }}
        className="glass space-y-6 rounded-card p-6 md:p-7"
      >
        <h3 id="planner-form-title" className="text-lg font-medium">Опишите поездку</h3>

        <fieldset className="space-y-3">
          <legend className="text-sm text-muted">Город</legend>
          <div className="grid gap-2">
            {(Object.keys(CITIES) as CityId[]).map((id) => (
              <label key={id} className="group block cursor-pointer">
                <input
                  type="radio"
                  name="city"
                  value={id}
                  checked={form.city === id}
                  onChange={() => update('city', id)}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                  className="peer sr-only"
                />
                <span className="flex items-center justify-between gap-4 rounded-2xl border border-line/10 bg-white/[.03] px-5 py-4 transition duration-300 ease-out group-hover:bg-white/[.06] peer-checked:border-accent/60 peer-checked:bg-accent/10 peer-focus-visible:ring-2 peer-focus-visible:ring-accent/50">
                  <span>
                    <span className="block font-serif text-xl">{CITIES[id].name}</span>
                    <span className="mt-1 block text-sm text-muted">{CITIES[id].tagline}</span>
                  </span>
                  <span aria-hidden className="text-sm text-muted">{form.city === id ? 'Выбран' : ''}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.city && <p id="city-error" role="alert" className="text-sm text-red-300">{errors.city}</p>}
        </fieldset>

        <Field id="budget" label={`Бюджет на всё: ${form.budget.toLocaleString('ru-RU')} €`} error={errors.budget}>
          <input
            id="budget"
            type="range"
            min={BUDGET_RANGE[0]}
            max={BUDGET_RANGE[1]}
            step={50}
            value={form.budget}
            aria-valuetext={`${form.budget} евро`}
            onChange={(e) => update('budget', Number(e.target.value))}
            className="w-full accent-[rgb(var(--accent-rgb))]"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field id="startDate" label="Выезд" error={errors.startDate}>
            <input id="startDate" type="date" value={form.startDate} aria-invalid={!!errors.startDate}
              onChange={(e) => update('startDate', e.target.value)} className={inputCls} />
          </Field>
          <Field id="endDate" label="Возвращение" error={errors.endDate}>
            <input id="endDate" type="date" value={form.endDate} aria-invalid={!!errors.endDate}
              onChange={(e) => update('endDate', e.target.value)} className={inputCls} />
          </Field>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm text-muted">Настроение поездки (до трёх)</legend>
          <div className="flex flex-wrap gap-2">
            {VIBES.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={form.vibes.includes(v)}
                onClick={() => toggleVibe(v)}
                className="rounded-full border border-line/10 px-4 py-2 text-sm text-muted transition duration-300 ease-out hover:text-fg aria-pressed:border-transparent aria-pressed:bg-accent aria-pressed:text-bg"
              >
                {VIBE_LABEL[v]}
              </button>
            ))}
          </div>
          {errors.vibes && <p role="alert" className="text-sm text-red-300">{errors.vibes}</p>}
        </fieldset>

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? 'Строю маршрут…' : 'Собрать маршрут'}
        </button>
      </form>

      <div aria-live="polite" className="min-h-[520px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.status}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={spring.soft}
          >
            <Result
              state={state}
              onRetry={() => submit(form)}
              onFixBudget={(min) => update('budget', min)}
              onPickAlternative={(budget) => { update('budget', budget); submit({ ...form, budget }); }}
              onReset={reset}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const ERROR_COPY: Record<string, string> = {
  UPSTREAM_TIMEOUT: 'Модель думает дольше обычного. Ваши данные сохранены — попробуйте ещё раз.',
  NETWORK: 'Нет связи с сервером. Проверьте интернет и повторите.',
  MODEL_OUTPUT_INVALID: 'Ответ получился неполным и не прошёл проверку. Повторите — обычно со второго раза всё хорошо.',
  UPSTREAM_ERROR: 'Сервис планирования временно недоступен. Повторите через минуту.',
  UNKNOWN: 'Что-то пошло не так. Повторите запрос.',
};

function Result({
  state, onRetry, onFixBudget, onPickAlternative,
}: {
  state: PlanState;
  onRetry: () => void;
  onFixBudget: (min: number) => void;
  onPickAlternative: (budget: number) => void;
  onReset: () => void;
}) {
  switch (state.status) {
    case 'idle':
      return (
        <div className="glass flex min-h-[520px] flex-col items-center justify-center rounded-card p-10 text-center">
          <p className="text-display text-3xl">Маршрут появится здесь</p>
          <p className="mt-3 max-w-sm text-muted">Укажите бюджет и даты. Aurora построит маршрут, карту и смету за несколько секунд.</p>
        </div>
      );

    case 'invalid':
      return (
        <div className="glass flex min-h-[520px] items-center justify-center rounded-card p-10">
          <p role="alert" className="text-muted">Проверьте поля слева: подсказки уже рядом с ними.</p>
        </div>
      );

    case 'loading':
      return <Loading />;

    case 'empty': {
      const days = dayCount(state.input.startDate, state.input.endDate);
      if (state.code === 'BUDGET_TOO_LOW' && state.minBudget) {
        return (
          <div className="glass flex min-h-[520px] flex-col items-center justify-center rounded-card p-10 text-center">
            <p className="text-display text-3xl">Бюджета не хватает на эту поездку</p>
            <p className="mt-3 max-w-md text-muted">
              На {days} {days === 1 ? 'день' : 'дней'} реалистичный минимум — {state.minBudget.toLocaleString('ru-RU')} €.
              Aurora не будет выдумывать маршрут, который не оплатит жизнь.
            </p>
            <button type="button" onClick={() => onFixBudget(state.minBudget!)} className="btn-ghost mt-8">
              Поставить {state.minBudget.toLocaleString('ru-RU')} €
            </button>
          </div>
        );
      }
      return (
        <div className="glass flex min-h-[520px] items-center justify-center rounded-card p-10 text-center">
          <p className="text-muted">Пока не умеем планировать этот город. Выберите один из доступных.</p>
        </div>
      );
    }

    case 'error':
      return (
        <div className="glass flex min-h-[520px] flex-col items-center justify-center rounded-card p-10 text-center">
          <p className="text-display text-3xl">Маршрут не собрался</p>
          <p role="alert" className="mt-3 max-w-md text-muted">{ERROR_COPY[state.code] ?? ERROR_COPY.UNKNOWN}</p>
          {state.retryable && (
            <button type="button" onClick={onRetry} className="btn-ghost mt-8">Повторить</button>
          )}
        </div>
      );

    case 'success': {
      const { plan, input } = state;
      return (
        <div className="space-y-6">
          <div className="glass rounded-card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-display text-3xl">{plan.city}</h3>
              <p className="text-sm tabular-nums text-muted">
                {dayCount(input.startDate, input.endDate)} дн. · {plan.budgetEur.toLocaleString('ru-RU')} €
              </p>
            </div>
            <div className="mt-6">
              <RouteMap stops={plan.days.flatMap((d) => d.stops)} />
            </div>
            <p className="mt-4 text-sm text-muted">Пролистайте ниже — тот же маршрут развернётся по дням.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <BudgetBreakdown total={plan.budgetEur} breakdown={plan.breakdown} />
            <Alternatives items={plan.alternatives} onPick={onPickAlternative} />
          </div>
        </div>
      );
    }
  }
}

function Loading() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % STAGES.length), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="glass space-y-6 rounded-card p-8">
      <p role="status" className="text-sm text-muted">{STAGES[i]}…</p>
      <div className="space-y-3">
        {[0, 1, 2].map((k) => (
          <div key={k} className="h-16 animate-pulse rounded-2xl bg-white/[.05]" />
        ))}
      </div>
    </div>
  );
}
