import type { TripPlan } from './types';

export function parseTripPlan(raw: unknown): TripPlan | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Partial<TripPlan>;
  if (!Array.isArray(p.days) || p.days.length === 0) return null;
  if (typeof p.budgetEur !== 'number' || !p.breakdown || !Array.isArray(p.alternatives)) return null;

  const valid = p.days.every(
    (d) =>
      Array.isArray(d.stops) &&
      d.stops.every(
        (s) =>
          typeof s.name === 'string' &&
          Number.isFinite(s.lat) && Math.abs(s.lat) <= 90 &&
          Number.isFinite(s.lng) && Math.abs(s.lng) <= 180,
      ),
  );
  return valid ? (p as TripPlan) : null;
}
