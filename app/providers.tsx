'use client';
import { MotionConfig } from 'framer-motion';
import { PlanProvider } from '@/lib/planner/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <PlanProvider>{children}</PlanProvider>
    </MotionConfig>
  );
}
