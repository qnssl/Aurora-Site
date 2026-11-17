'use client';
import { motion } from 'framer-motion';
import { spring } from '@/lib/tokens';
import { RouteField } from '@/components/system/RouteField';

const HEADLINE = 'Build digital products that feel effortless'.split(' ');
const SUBTITLE = 'I design and build fast, accessible web products — from concept to production.';
const GITHUB_URL = 'https://github.com/qnssl';

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden px-6 pb-24 pt-36 md:pt-48">
      <div aria-hidden className="route-mask pointer-events-none absolute inset-0 -z-10">
        <RouteField />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-line/10 px-3 py-1 text-sm text-muted"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          Concept demo · Portfolio case study
        </motion.p>

        <h1 className="text-display mt-8 max-w-4xl text-5xl md:text-8xl">
          {HEADLINE.map((word, i) => (
            <span key={`${word}-${i}`}>
              {i > 0 && ' '}
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: '0.4em', filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ ...spring.soft, delay: 0.15 + i * 0.07 }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, ...spring.gentle }}
          className="mt-8 max-w-xl text-lg text-muted"
        >
          {SUBTITLE}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <a href="#demo" className="btn-primary">Try the planner</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
