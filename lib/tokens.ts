import type { Transition } from 'framer-motion';

export const color = {
  bg: '#07080B',
  fg: '#F5F5F7',
  muted: '#A1A1AA',
  accent: '#7CF5D0',
  accent2: '#6E8BFF',
  accent3: '#C58BFF',
} as const;

export const spring: Record<'snappy' | 'soft' | 'gentle', Transition> = {
  snappy: { type: 'spring', stiffness: 420, damping: 34, mass: 0.6 },
  soft: { type: 'spring', stiffness: 180, damping: 26 },
  gentle: { type: 'spring', stiffness: 90, damping: 20 },
};
