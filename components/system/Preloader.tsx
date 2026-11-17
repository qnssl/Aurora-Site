'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const progress = useMotionValue(0);
  const width = useTransform(progress, (v) => `${v}%`);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const minTime = new Promise((r) => setTimeout(r, 900));
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const run = animate(progress, 85, { duration: 0.9, ease: 'easeOut' });

    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    Promise.all([minTime, fonts]).then(() => {
      animate(progress, 100, { duration: 0.25 });
      hideTimer = setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = '';
      }, 300);
    });

    return () => {
      run.stop();
      clearTimeout(hideTimer);
      document.body.style.overflow = '';
    };
  }, [progress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Загрузка Aurora"
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-[100] grid place-items-center bg-bg"
        >
          <div className="w-56">
            <p className="text-display text-center text-3xl">Aurora</p>
            <div className="mt-6 h-px w-full bg-white/10">
              <motion.div className="h-px origin-left bg-accent" style={{ width }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
