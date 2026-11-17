export const VIBES = ['culture', 'food', 'nature', 'nightlife', 'slow', 'adventure'] as const;
export type Vibe = (typeof VIBES)[number];
export type CityId = 'lisbon' | 'kyoto' | 'marrakech';

export interface PlanInput {
  city: CityId;
  budget: number;
  startDate: string;
  endDate: string;
  vibes: Vibe[];
}

export interface Stop {
  name: string;
  lat: number;
  lng: number;
  time: string;
  kind: Vibe;
  costEur: number;
  note: string;
}

export interface DayPlan {
  index: number;
  date: string;
  title: string;
  stops: Stop[];
}

export interface Breakdown {
  stay: number;
  food: number;
  activities: number;
  transport: number;
  buffer: number;
}

export interface Alternative {
  id: string;
  title: string;
  summary: string;
  budgetEur: number;
}

export interface TripPlan {
  id: string;
  city: string;
  center: { lat: number; lng: number };
  days: DayPlan[];
  budgetEur: number;
  breakdown: Breakdown;
  alternatives: Alternative[];
}

export type ErrorCode =
  | 'INVALID_INPUT'
  | 'BUDGET_TOO_LOW'
  | 'CITY_NOT_SUPPORTED'
  | 'UPSTREAM_TIMEOUT'
  | 'UPSTREAM_ERROR'
  | 'MODEL_OUTPUT_INVALID'
  | 'NETWORK'
  | 'UNKNOWN';
