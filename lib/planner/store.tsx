'use client';

import { createContext, useCallback, useContext, useEffect, useReducer, useRef, type ReactNode } from 'react';
import type { ErrorCode, PlanInput, TripPlan } from './types';
import { validateInput } from './validate';
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
  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => controller.current?.abort(), []);

  const submit = useCallback(async (raw: unknown) => {
    const v = validateInput(raw);
    if (!v.ok) {
      dispatch({ type: 'invalid', errors: v.errors });
      return;
    }
    controller.current?.abort();
    const c = new AbortController();
    controller.current = c;
    dispatch({ type: 'submit', input: v.input });

    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(v.input),
        signal: c.signal,
      });
      const data: { plan?: TripPlan; code?: ErrorCode; minBudget?: number } = await res.json();
      if (res.ok && data.plan) dispatch({ type: 'ok', input: v.input, plan: data.plan });
      else dispatch({ type: 'fail', input: v.input, code: data.code ?? 'UNKNOWN', minBudget: data.minBudget });
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      dispatch({ type: 'fail', input: v.input, code: 'NETWORK' });
    }
  }, []);

  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  return <PlanContext.Provider value={{ state, submit, reset }}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan должен использоваться внутри PlanProvider');
  return ctx;
}
