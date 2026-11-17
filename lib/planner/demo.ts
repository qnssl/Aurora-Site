import { CITIES } from './catalog';
import { addDays, dayCount } from './validate';
import type { DayPlan, PlanInput, Stop, TripPlan } from './types';

const TITLES = ['Прибытие и первый вечер', 'Ритм города', 'Вкус и ремесло', 'Выход за город', 'Последняя ночь'];

export function generateDemoPlan(input: PlanInput): TripPlan {
  const city = CITIES[input.city];
  const days = dayCount(input.startDate, input.endDate);
  const matching = city.stops.filter((s) => input.vibes.includes(s.vibe));
  const pool = matching.length >= 3 ? matching : city.stops;

  const dayPlans: DayPlan[] = Array.from({ length: days }, (_, i) => {
    const stops: Stop[] = [0, 1, 2].map((k) => {
      const s = pool[(i + k) % pool.length];
      return {
        name: s.name,
        lat: +(city.lat + s.dLat).toFixed(5),
        lng: +(city.lng + s.dLng).toFixed(5),
        time: ['09:30', '13:30', '19:30'][k],
        kind: s.vibe,
        costEur: s.cost,
        note: s.note,
      };
    });
    return { index: i, date: addDays(input.startDate, i), title: TITLES[i % TITLES.length], stops };
  });

  const activities = Math.min(
    dayPlans.reduce((sum, d) => sum + d.stops.reduce((a, s) => a + s.costEur, 0), 0),
    Math.round(input.budget * 0.2),
  );
  const stay = Math.round(input.budget * 0.42);
  const food = Math.round(input.budget * 0.24);
  const transport = Math.round(input.budget * 0.1);
  const buffer = Math.round(input.budget - stay - food - transport - activities);

  return {
    id: `${input.city}-${input.startDate}-${input.budget}`,
    city: city.name,
    center: { lat: city.lat, lng: city.lng },
    days: dayPlans,
    budgetEur: input.budget,
    breakdown: { stay, food, activities, transport, buffer },
    alternatives: [
      { id: 'lean', title: 'Тише и дешевле', summary: 'Меньше переездов, гостевой дом вместо отеля.', budgetEur: Math.round(input.budget * 0.82) },
      { id: 'rich', title: 'Больше впечатлений', summary: 'Дегустационный ужин и один премиальный день.', budgetEur: Math.round(input.budget * 1.18) },
    ],
  };
}
