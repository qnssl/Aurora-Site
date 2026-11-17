'use client';

import { createContext, useCallback, useContext, useReducer, type ReactNode } from 'react';
import type { ErrorCode, PlanInput, TripPlan } from './types';
import { generateDemoPlan } from './demo';
import { dayCount, MIN_PER_DAY, validateInput } from './validate';

export type PlanState =
    | { status: 'idle' }
    | { status: 'invalid'; errors: Record<string, string | undefined> }
    | { status: 'loading'; input: PlanInput }
    | { status: 'success'; input: PlanInput; plan: TripPlan }
    | { status: 'empty'; code: 'BUDGET_TOO_LOW' | 'CITY_NOT_SUPPORTED'; minBudget?: number; input: PlanInput }
    | { status: 'error'; code: ErrorCode; retryable: boolean; input: PlanInput };

type Action =
    | { type: 'submit'; input: PlanInput }
    | { type: 'invalid'; errors: Record<string, string | undefined> }
    | { type: 'ok'; input: PlanInput; plan: TripPlan }
    | { type: 'fail'; input: PlanInput; code: ErrorCode; minBudget?: number }
    | { type: 'reset' };

function reducer(state: PlanState, action: Action): PlanState {
  switch (action.type) {
    case 'submit':
      return { status: 'loading', input: action.input };
    case 'invalid':
      return { status: 'invalid', errors: action.errors };
    case 'ok':
      return state.status === 'loading' ? { status: 'success', input: action.input, plan: action.plan } : state;
    case 'fail': {
      if (state.status !== 'loading') return state;
      if (action.code === 'BUDGET_TOO_LOW' || action.code === 'CITY_NOT_SUPPORTED') {
        return { status: 'empty', code: action.code, minBudget: action.minBudget, input: action.input };
      }
      return { status: 'error', code: action.code, retryable: action.code !== 'INVALID_INPUT', input: action.input };
    }
    case 'reset':
      return { status: 'idle' };
  }
}

interface PlanContextValue {
  state: PlanState;
  submit: (raw: unknown) => void;
  reset: () => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { status: 'idle' } as PlanState);

  const submit = useCallback(async (raw: unknown) => {
    const v = validateInput(raw);
    if (!v.ok) {
      dispatch({ type: 'invalid', errors: v.errors });
      return;
    }
    dispatch({ type: 'submit', input: v.input });

    await new Promise((r) => setTimeout(r, 900));

    const minBudget = dayCount(v.input.startDate, v.input.endDate) * MIN_PER_DAY;
    if (v.input.budget < minBudget) {
      dispatch({ type: 'fail', input: v.input, code: 'BUDGET_TOO_LOW', minBudget });
      return;
    }
    dispatch({ type: 'ok', input: v.input, plan: generateDemoPlan(v.input) });
  }, []);

  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  return <PlanContext.Provider value={{ state, submit, reset }}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan должен использоваться внутри PlanProvider');
  return ctx;
}