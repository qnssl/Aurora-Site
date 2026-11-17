export interface SiteLinks {
  liveUrl?: string;
  repoUrl?: string;
}

function toHttpUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export const SITE: SiteLinks = {
  liveUrl: toHttpUrl(process.env.NEXT_PUBLIC_LIVE_URL),
  repoUrl: toHttpUrl(process.env.NEXT_PUBLIC_REPO_URL) ?? 'https://github.com/qnssl',
};
