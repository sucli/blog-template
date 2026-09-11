import siteConfig from '../site.config.json';

export type NavItem = { label: string; href: string };
export type SocialKey = 'github' | 'x' | 'weibo' | 'zhihu' | 'bilibili' | 'juejin';
export type AboutSection = { title: string; body: string };
export type CommentsConfig = {
  enabled: boolean;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: string;
  theme: string;
};

const SOCIAL_LABELS: Record<SocialKey, string> = {
  github: 'GitHub',
  x: 'X',
  weibo: '微博',
  zhihu: '知乎',
  bilibili: '哔哩哔哩',
  juejin: '掘金'
};

function assertSiteConfig(config: typeof siteConfig) {
  if (!Number.isInteger(config.postsPerPage) || config.postsPerPage < 1) {
    throw new Error('site.config.json: postsPerPage must be a positive integer');
  }
  if (!Array.isArray(config.nav) || config.nav.length === 0) {
    throw new Error('site.config.json: nav must be a non-empty array');
  }
  for (const item of config.nav) {
    if (!item.label?.trim() || !item.href?.startsWith('/')) {
      throw new Error('site.config.json: each nav item needs a label and href starting with "/"');
    }
  }
  const comments = config.comments;
  if (comments?.enabled) {
    for (const key of ['repo', 'repoId', 'category', 'categoryId'] as const) {
      if (!comments[key]?.trim()) {
        throw new Error(`site.config.json: comments.${key} is required when comments.enabled is true`);
      }
    }
  }
  const related = config.relatedPosts;
  if (related && (!Number.isInteger(related.limit) || related.limit < 1)) {
    throw new Error('site.config.json: relatedPosts.limit must be a positive integer');
  }
}

assertSiteConfig(siteConfig);

export const SITE = siteConfig;

export const NAV_ITEMS: NavItem[] = SITE.nav;

export const ABOUT = SITE.about;

export function getCommentsConfig(): CommentsConfig | null {
  if (!SITE.comments?.enabled) return null;
  return SITE.comments;
}

export function getRelatedPostsOptions() {
  return {
    enabled: SITE.relatedPosts?.enabled ?? true,
    limit: SITE.relatedPosts?.limit ?? 3
  };
}

export function getSocialLinks(): { key: SocialKey; label: string; href: string }[] {
  return (Object.keys(SOCIAL_LABELS) as SocialKey[])
    .map((key) => ({ key, label: SOCIAL_LABELS[key], href: SITE.social[key] ?? '' }))
    .filter((item) => Boolean(item.href));
}

export function withBase(path: string) {
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}` || '/';
}
