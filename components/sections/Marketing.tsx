'use client';
import { motion } from 'framer-motion';
import { spring } from '@/lib/tokens';

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: spring.gentle,
};

export function Features() {
  const items = [
    { title: 'Маршрут по дням', body: 'Ритм, время и районы подбираются под энергию дня, а не под список достопримечательностей.', span: 'md:col-span-2 md:row-span-2' },
    { title: 'Смета в реальном времени', body: 'Бюджет делится на жильё, еду и впечатления. Перерасход виден сразу.', span: '' },
    { title: 'Альтернативы одним касанием', body: 'Тише и дешевле или ярче и дороже. Маршрут пересчитается, а не начнётся заново.', span: '' },
    { title: 'Карта, а не список', body: 'Каждая остановка — точка в пространстве. Соседние дни не пересекаются без причины.', span: 'md:col-span-2' },
  ];
  return (
    <section id="features" aria-labelledby="features-title" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <motion.h2 {...reveal} id="features-title" className="text-display max-w-2xl text-4xl md:text-6xl">
        Меньше таблиц. Больше ощущения, что поездка уже идёт.
      </motion.h2>
      <div className="mt-16 grid auto-rows-[minmax(200px,auto)] gap-4 md:grid-cols-3">
        {items.map((it, i) => (
          <motion.article
            key={it.title}
            {...reveal}
            transition={{ ...spring.gentle, delay: i * 0.08 }}
            className={`glass group rounded-card p-7 transition duration-500 ease-out hover:-translate-y-1 ${it.span}`}
          >
            <h3 className="text-xl font-medium">{it.title}</h3>
            <p className="mt-3 max-w-sm text-muted">{it.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function FAQ() {
  const items: [string, string][] = [
    ['Что будет, если бюджет слишком мал?', 'Aurora не станет выдумывать маршрут, который не оплатит жизнь. Вы увидите минимальную сумму для вашего числа дней.'],
    ['Можно ли поменять город после расчёта?', 'Да. Выберите другой город, и маршрут пересоберётся с теми же датами и бюджетом.'],
    ['Как считается смета?', 'Жильё, еда, впечатления и переезды считаются отдельно. Запас показывает, сколько осталось до лимита.'],
    ['Что происходит с моими данными?', 'В демо-версии план не записывается на сервер и живёт только в состоянии текущей вкладки. Перезагрузка страницы его очищает.'],
  ];
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto max-w-3xl px-6 py-24">
      <motion.h2 {...reveal} id="faq-title" className="text-display text-4xl md:text-5xl">Вопросы</motion.h2>
      <div className="mt-10 divide-y divide-line/10 border-y border-line/10">
        {items.map(([q, a]) => (
          <details key={q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg transition-colors hover:text-accent">
              {q}
              <span aria-hidden className="text-muted transition-transform duration-300 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 max-w-2xl text-muted">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section aria-labelledby="cta-title" className="aurora-bg glass mx-auto my-12 max-w-6xl rounded-[2.5rem] px-6 py-24 text-center">
      <h2 id="cta-title" className="text-display text-4xl md:text-6xl">Ваша следующая поездка начинается с одного запроса.</h2>
      <a href="#demo" className="btn-primary mt-10">Собрать маршрут</a>
    </section>
  );
}
