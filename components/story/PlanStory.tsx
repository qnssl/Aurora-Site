'use client';
import { usePlan } from '@/lib/planner/store';
import { generateDemoPlan } from '@/lib/planner/demo';
import { StoryDays } from './StoryDays';

const SAMPLE = generateDemoPlan({
  city: 'lisbon', budget: 1800, startDate: '2027-05-10', endDate: '2027-05-13', vibes: ['culture', 'food'],
});

export function PlanStory() {
  const { state } = usePlan();
  const isSample = state.status !== 'success';
  return <StoryDays plan={state.status === 'success' ? state.plan : SAMPLE} isSample={isSample} />;
}
