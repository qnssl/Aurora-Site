import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const sans = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-sans', display: 'swap' });
const serif = Source_Serif_4({ subsets: ['latin', 'cyrillic'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: 'Aurora — планировщик путешествий',
  description: 'Concept demo. Введите бюджет, даты и настроение: Aurora соберёт маршрут по дням, карту, смету и запасные варианты.',
};

export const viewport: Viewport = { themeColor: '#07080B', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${sans.variable} ${serif.variable}`}>
      <body className="bg-bg font-sans text-fg antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
        >
          Перейти к содержанию
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
