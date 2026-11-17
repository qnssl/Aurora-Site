import { CITIES } from './catalog';
import { VIBES, type CityId, type PlanInput, type Vibe } from './types';

export const MAX_DAYS = 14;
export const MIN_PER_DAY = 110;
export const BUDGET_RANGE = [300, 6000] as const;

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export const dayCount = (start: string, end: string) =>
  Math.round((Date.parse(end) - Date.parse(start)) / 864e5) + 1;

export const addDays = (start: string, n: number) =>
  new Date(Date.parse(start) + n * 864e5).toISOString().slice(0, 10);

export type ValidationResult =
  | { ok: true; input: PlanInput }
  | { ok: false; errors: Partial<Record<keyof PlanInput, string>> };

export function validateInput(raw: unknown, today = new Date().toISOString().slice(0, 10)): ValidationResult {
  const r = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  const errors: Partial<Record<keyof PlanInput, string>> = {};

  const city = r.city as CityId;
  if (!(city in CITIES)) errors.city = 'Выберите город из списка';

  const budget = Number(r.budget);
  if (!Number.isFinite(budget) || budget < BUDGET_RANGE[0] || budget > BUDGET_RANGE[1]) {
    errors.budget = `Бюджет от ${BUDGET_RANGE[0]} до ${BUDGET_RANGE[1]} €`;
  }

  const startDate = String(r.startDate ?? '');
  const endDate = String(r.endDate ?? '');
  if (!ISO.test(startDate) || !ISO.test(endDate)) errors.startDate = 'Укажите даты поездки';
  else if (startDate < today) errors.startDate = 'Дата начала уже прошла';
  else if (endDate < startDate) errors.endDate = 'Дата окончания раньше даты начала';
  else if (dayCount(startDate, endDate) > MAX_DAYS) errors.endDate = `Не больше ${MAX_DAYS} дней`;

  const vibes = Array.isArray(r.vibes)
    ? r.vibes.filter((v): v is Vibe => (VIBES as readonly string[]).includes(v as string))
    : [];
  if (vibes.length < 1 || vibes.length > 3) errors.vibes = 'Выберите от одного до трёх настроений';

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, input: { city, budget: Math.round(budget), startDate, endDate, vibes } };
}
