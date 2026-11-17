export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  href?: string;
}

const PROJECTS: Project[] = [
  {
    id: 'aurora',
    title: 'Aurora — AI travel planner',
    description:
      'Concept demo. Budget, dates and mood go in; a day-by-day route, map and budget breakdown come out.',
    tags: ['Next.js', 'TypeScript', 'Framer Motion'],
    href: '#demo',
  },
];

// Имитация асинхронного запроса. Замените тело на fetch, когда появится источник данных.
export async function loadFeaturedProjects(): Promise<Project[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return PROJECTS;
}
