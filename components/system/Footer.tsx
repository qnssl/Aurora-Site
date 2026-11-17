import { SITE } from '@/lib/site';

const PLACEHOLDER_EMAIL = 'example.mail@gmail.com';

export function Footer() {
  return (
    <footer id="contact" className="border-t border-line/10">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-display text-3xl">Aurora</p>
          <p className="mt-4 max-w-xs text-sm text-muted">
            Концепт планировщика путешествий. Создан как portfolio case study.
          </p>
          <p className="mt-8 inline-flex items-center gap-2 text-sm text-muted">
            <span aria-hidden className="size-2 rounded-full bg-accent" />
            Built for demonstration purposes
          </p>
        </div>

        <nav aria-label="Разделы сайта">
          <h3 className="text-sm font-medium">Сайт</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><a href="#demo" className="rounded-md transition-colors hover:text-fg">Демо</a></li>
            <li><a href="#story" className="rounded-md transition-colors hover:text-fg">Маршрут по дням</a></li>
            <li><a href="#case" className="rounded-md transition-colors hover:text-fg">Кейс</a></li>
            <li><a href="#faq" className="rounded-md transition-colors hover:text-fg">Вопросы</a></li>
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-medium">Контакт</h3>
          <a
            href={`mailto:${PLACEHOLDER_EMAIL}`}
            className="mt-4 inline-block rounded-md text-sm text-fg transition-colors hover:text-accent"
          >
            {PLACEHOLDER_EMAIL}
          </a>
          <p className="mt-2 text-xs text-muted">Заглушка. Замените на рабочий адрес.</p>
          <ul className="mt-6 space-y-3 text-sm text-muted">
            {SITE.repoUrl && (
              <li>
                <a href={SITE.repoUrl} target="_blank" rel="noopener noreferrer" className="rounded-md transition-colors hover:text-fg">
                  GitHub<span className="sr-only"> (откроется в новой вкладке)</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-line/10 px-6 py-6 text-xs text-muted">
        <p>© 2026 Aurora. Концепт для портфолио.</p>
        <a href="#top" className="rounded-md transition-colors hover:text-fg">Наверх ↑</a>
      </div>
    </footer>
  );
}
