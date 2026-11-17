import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-40">
      <h1 className="text-display text-5xl">Projects</h1>
      <p className="mt-4 text-muted">Полный список проектов появится в следующей итерации.</p>
      <Link href="/#projects" className="btn-ghost mt-8">Назад к главной</Link>
    </main>
  );
}
