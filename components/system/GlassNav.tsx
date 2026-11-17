'use client';
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';

const links = [
  { href: '#top', id: 'top', label: 'Home' },
  { href: '#demo', id: 'demo', label: 'Planner' },
  { href: '#case', id: 'case', label: 'Case Studies' },
  { href: '#contact', id: 'contact', label: 'Contact' },
];

const HEADER_OFFSET = 72;

export function GlassNav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pendingTarget = useRef<string | null>(null);

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  const closeMenu = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;

      const nodes: HTMLElement[] = [];
      if (buttonRef.current) nodes.push(buttonRef.current);
      panelRef.current?.querySelectorAll<HTMLElement>('a[href]').forEach((el) => nodes.push(el));

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      const inside = nodes.some((n) => n === active);

      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeMenu]);

  useEffect(() => {
    if (open || !pendingTarget.current) return;
    const id = pendingTarget.current;
    pendingTarget.current = null;

    const el = document.getElementById(id);
    if (!el && id !== 'top') return;

    const top = el ? el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET : 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', `#${id}`);
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const onNavigate = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    pendingTarget.current = id;
    closeMenu();
  };

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background,border-color] duration-300 ease-out ${
          scrolled ? 'glass border-line/10' : 'border-transparent'
        }`}
      >
        <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#top" className="rounded-md font-serif text-xl">Aurora</a>

          <ul className="hidden items-center gap-8 text-sm text-muted md:flex">
            {links.map((l) => (
              <li key={l.id}>
                <a href={l.href} className="rounded-md transition-colors duration-200 hover:text-fg">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href="#demo" className="btn-primary hidden !px-4 !py-2 text-sm md:inline-flex">
              Try demo
            </a>
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => (open ? closeMenu() : setOpen(true))}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line/10 md:hidden"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
              >
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </nav>
      </motion.header>

      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="glass fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto md:hidden"
        >
          <nav aria-label="Mobile navigation" className="px-6 py-10">
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.href}
                    onClick={(e) => onNavigate(e, l.id)}
                    className="text-display block rounded-2xl px-2 py-3 text-4xl transition-colors hover:text-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      )}
    </>
  );
}
