'use client';
import { useEffect, useState } from 'react';
import { loadFeaturedProjects, type Project } from '@/lib/projects';

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; projects: Project[] };

const SHIMMER_CSS = `
@keyframes aurora-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.aurora-shimmer {
  background-image: linear-gradient(100deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 60%);
  background-size: 200% 100%;
  animation: aurora-shimmer 1.6s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .aurora-shimmer { animation: none; }
}
`;

// Повторяет структуру итоговой карточки: изображение, заголовок, описание, теги.
function SkeletonCard() {
  return (
    <div className="glass flex h-full flex-col overflow-hidden rounded-card">
      <div className="aurora-shimmer aspect-[16/10] bg-white/[.06]" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="aurora-shimmer h-5 w-2/3 rounded-md bg-white/[.06]" />
        <div className="aurora-shimmer h-3 w-full rounded-md bg-white/[.06]" />
        <div className="aurora-shimmer h-3 w-5/6 rounded-md bg-white/[.06]" />
        <div className="mt-auto flex gap-2 pt-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aurora-shimmer h-6 w-16 rounded-full bg-white/[.06]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FeaturedProjects() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    loadFeaturedProjects()
      .then((projects) => {
        if (active) setState({ status: 'ready', projects });
      })
      .catch(() => {
        if (active) setState({ status: 'error' });
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="projects" aria-labelledby="projects-title" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <style>{SHIMMER_CSS}</style>

      <p className="inline-flex items-center rounded-full border border-line/10 px-3 py-1 text-sm text-muted">
        Projects
      </p>
      <h2 id="projects-title" className="text-display mt-6 max-w-3xl text-4xl md:text-6xl">
        Featured work
      </h2>

      {state.status === 'loading' && (
        <>
          <p role="status" className="sr-only">Loading projects…</p>
          <ul aria-busy="true" className="mt-12 grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <li key={i} aria-hidden="true">
                <SkeletonCard />
              </li>
            ))}
          </ul>
        </>
      )}

      {state.status === 'error' && (
        <p role="alert" className="glass mt-12 rounded-card p-8 text-center text-muted">
          Could not load projects. Refresh the page to try again.
        </p>
      )}

      {state.status === 'ready' && state.projects.length === 0 && (
        <p role="status" className="glass mt-12 rounded-card p-8 text-center text-muted">
          No projects available yet.
        </p>
      )}

      {state.status === 'ready' && state.projects.length > 0 && (
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {state.projects.map((p) => (
            <li key={p.id}>
              <article className="glass flex h-full flex-col overflow-hidden rounded-card">
                <div aria-hidden className="aspect-[16/10] bg-gradient-to-br from-accent/30 via-accent2/20 to-accent3/30" />
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="text-lg font-medium">{p.title}</h3>
                  <p className="text-sm text-muted">{p.description}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                    {p.tags.map((t) => (
                      <li key={t} className="rounded-full border border-line/10 px-3 py-1 text-xs text-muted">
                        {t}
                      </li>
                    ))}
                  </ul>
                  {p.href && (
                    <a href={p.href} className="rounded-md pt-2 text-sm text-accent hover:underline">
                      View project<span className="sr-only"> {p.title}</span>
                    </a>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
