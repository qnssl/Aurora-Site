import { Preloader } from '@/components/system/Preloader';
import { CustomCursor } from '@/components/system/CustomCursor';
import { GlassNav } from '@/components/system/GlassNav';
import { Footer } from '@/components/system/Footer';
import { Hero } from '@/components/sections/Hero';
import { Features, FAQ, CTA } from '@/components/sections/Marketing';
import { CaseStudy } from '@/components/sections/CaseStudy';
import { Planner } from '@/components/planner/Planner';
import { PlanStory } from '@/components/story/PlanStory';
import { SITE } from '@/lib/site';

export default function Page() {
  return (
    <>
      <Preloader />
      <CustomCursor />
      <GlassNav />
      <main id="main">
        <Hero />
        <section id="demo" aria-labelledby="demo-title" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="text-sm text-accent">Интерактивная демо</p>
          <h2 id="demo-title" className="text-display mt-4 max-w-3xl text-4xl md:text-6xl">
            Один запрос. Весь маршрут.
          </h2>
          <p className="mt-5 max-w-xl text-muted">
            Aurora учитывает бюджет как ограничение, а не пожелание: смета считается вместе с маршрутом.
          </p>
          <div className="mt-12">
            <Planner />
          </div>
        </section>
        <PlanStory />
        <Features />
        <CaseStudy liveUrl={SITE.liveUrl} repoUrl={SITE.repoUrl} />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
