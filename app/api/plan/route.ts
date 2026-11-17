import { NextResponse } from 'next/server';
import { generateDemoPlan } from '@/lib/planner/demo';
import { parseTripPlan } from '@/lib/planner/parse';
import { dayCount, MIN_PER_DAY, validateInput } from '@/lib/planner/validate';
import type { PlanInput } from '@/lib/planner/types';

export const runtime = 'nodejs';

const SYSTEM = `Ты — планировщик путешествий Aurora.
Верни ТОЛЬКО JSON по схеме TripPlan: { id, city, center:{lat,lng}, days:[{index,date,title,stops:[{name,lat,lng,time,kind,costEur,note}]}], budgetEur, breakdown:{stay,food,activities,transport,buffer}, alternatives:[{id,title,summary,budgetEur}] }.
Без пояснений и markdown. Все суммы в EUR. Координаты реальные. Бюджет — жёсткое ограничение: сумма breakdown не должна превышать budgetEur.
Два альтернативных варианта: тише и дешевле, ярче и дороже.`;

async function callModel(input: PlanInput, signal: AbortSignal): Promise<unknown> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.AURORA_MODEL ?? 'claude-sonnet-5-5',
      max_tokens: 4000,
      system: SYSTEM,
      messages: [{ role: 'user', content: JSON.stringify(input) }],
    }),
    signal,
  });
  if (!res.ok) throw new Error(`upstream_${res.status}`);

  const data: { content: { type: string; text?: string }[] } = await res.json();
  const text = data.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('');
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  const v = validateInput(body);
  if (!v.ok) return NextResponse.json({ code: 'INVALID_INPUT', errors: v.errors }, { status: 400 });

  const { input } = v;
  const minBudget = dayCount(input.startDate, input.endDate) * MIN_PER_DAY;
  if (input.budget < minBudget) {
    return NextResponse.json({ code: 'BUDGET_TOO_LOW', minBudget }, { status: 422 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    await new Promise((r) => setTimeout(r, 900));
    return NextResponse.json({ plan: generateDemoPlan(input) });
  }

  try {
    const plan = parseTripPlan(await callModel(input, AbortSignal.timeout(25_000)));
    if (!plan) return NextResponse.json({ code: 'MODEL_OUTPUT_INVALID' }, { status: 502 });
    return NextResponse.json({ plan });
  } catch (e) {
    const timeout = e instanceof Error && (e.name === 'TimeoutError' || e.name === 'AbortError');
    return NextResponse.json(
      { code: timeout ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_ERROR' },
      { status: timeout ? 504 : 502 },
    );
  }
}
