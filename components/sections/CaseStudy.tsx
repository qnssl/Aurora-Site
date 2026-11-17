import type { ReactNode } from 'react';

export interface CaseStudyProps {
  liveUrl?: string;
  repoUrl?: string;
}

const ROLE = 'Full-stack Developer & Product Designer';
const DISCLAIMER = 'Portfolio case study — concept demo, not a production product.';

const STACK = ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion'];

const ARCHITECTURE = [
  'Форма и результат читают одно состояние (PlanProvider на reducer), поэтому они не расходятся.',
  'validateInput — чистая функция, одинаковая в браузере и в API route.',
  '/api/plan проверяет вход и минимальный бюджет, затем отдаёт маршрут из внешнего сервиса или демо-генератора.',
  'parseTripPlan — граница доверия: ответ внешнего сервиса не попадает в интерфейс без проверки структуры.',
  'Карта — SVG-проекция без внешних тайлов и сетевых запросов.',
];

const DECISIONS = [
  { title: 'Бюджет как ограничение', body: 'Смета считается вместе с маршрутом и показывает перерасход. Ответ с суммой выше бюджета не проходит проверку.' },
  { title: 'Framer Motion вместо GSAP', body: 'Нужны spring-переходы, useScroll для сторителлинга и MotionConfig с reducedMotion. Второй движок не окупается.' },
  { title: 'Без WebGL по умолчанию', body: 'Маршрут читается лучше как карта-схема и история по дням. Глобус можно добавить позже отдельным client-only модулем.' },
  { title: 'Демо без ключа', body: 'Детерминированный генератор работает без внешних сервисов, поэтому сайт проверяется без секретов.' },
];

function safeHref(value?: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function Chapter({ no, title, children }: { no: string; title: string; children: ReactNode }) {
  return (
    <div className="grid gap-4 border-t border-[#07080B]/15 py-12 md:grid-cols-[96px_1fr] md:py-16">
      <p className="font-serif text-sm tabular-nums text-[#4a4a55]">{no}</p>
      <div>
        <h3 className="text-display text-3xl md:text-4xl">{title}</h3>
        <div className="mt-6 max-w-prose space-y-5 text-lg leading-8 text-[#2b2b33]">{children}</div>
      </div>
    </div>
  );
}

export function CaseStudy({ liveUrl, repoUrl }: CaseStudyProps) {
  const live = safeHref(liveUrl);
  const repo = safeHref(repoUrl);

  return (
    <section id="case" aria-labelledby="case-title" className="bg-[#f4f3f8] text-[#07080B]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_2fr] md:gap-16 md:py-32">
        <header className="md:sticky md:top-32 md:self-start">
          <p className="text-sm uppercase tracking-[0.18em] text-[#4a4a55]">Portfolio case study</p>
          <h2 id="case-title" className="text-display mt-6 text-5xl md:text-6xl">Как устроен Aurora</h2>
          <p className="mt-6 text-[#4a4a55]">{DISCLAIMER}</p>

          {(live || repo) && (
            <div className="mt-10 flex flex-col items-start gap-3">
              {live && (
                <a href={live} target="_blank" rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-[#07080B] px-6 py-3 text-sm font-medium text-[#F5F5F7] transition hover:bg-[#2b2b33]">
                  Открыть live demo<span className="sr-only"> (откроется в новой вкладке)</span>
                </a>
              )}
              {repo && (
                <a href={repo} target="_blank" rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-[#07080B]/25 px-6 py-3 text-sm font-medium transition hover:bg-[#07080B]/5">
                  Исходный код на GitHub<span className="sr-only"> (откроется в новой вкладке)</span>
                </a>
              )}
            </div>
          )}
        </header>

        <div>
          <Chapter no="01" title="Проблема">
            <p>
              Планировщики выдают список мест. Бюджет в них — пожелание, которое никто не пересчитывает.
              Смету приходится сводить вручную, а перерасход становится видным только в конце.
            </p>
          </Chapter>

          <Chapter no="02" title="Роль">
            <p>{ROLE}</p>
          </Chapter>

          <Chapter no="03" title="Решение">
            <p>
              Пользователь задаёт бюджет, даты и настроение. Aurora строит маршрут по дням, карту, смету
              и два альтернативных варианта. Альтернатива пересчитывает план, а не начинает заново.
            </p>
            <p>Если бюджета не хватает, интерфейс называет минимальную сумму и не выдумывает маршрут.</p>
          </Chapter>

          <Chapter no="04" title="Архитектура">
            <ol className="space-y-5 border-l border-[#07080B]/20 pl-6">
              {ARCHITECTURE.map((item, i) => (
                <li key={item} className="relative">
                  <span aria-hidden className="absolute -left-[29px] top-3 size-2 rounded-full bg-[#07080B]" />
                  <span className="mr-3 font-serif text-sm tabular-nums text-[#4a4a55]">{String(i + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ol>
          </Chapter>

          <Chapter no="05" title="Ключевые решения">
            <dl className="space-y-8">
              {DECISIONS.map((d) => (
                <div key={d.title}>
                  <dt className="text-display text-2xl">{d.title}</dt>
                  <dd className="mt-2 text-[#2b2b33]">{d.body}</dd>
                </div>
              ))}
            </dl>
          </Chapter>

          <Chapter no="06" title="Стек">
            <p className="text-base text-[#4a4a55]">{STACK.join(' · ')}</p>
          </Chapter>

          <Chapter no="07" title="Состояния интерфейса">
            <p>
              Idle, invalid, loading, success, два вида empty (бюджет мал, город не поддержан) и error с повтором.
              Устаревший запрос отменяется при новом submit.
            </p>
          </Chapter>
        </div>
      </div>
    </section>
  );
}
