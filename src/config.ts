import siteConfig from '../site.config.json';

if (!Number.isInteger(siteConfig.postsPerPage) || siteConfig.postsPerPage < 1) {
  throw new Error('site.config.json: postsPerPage must be a positive integer');
}

export const SITE = siteConfig;

export const NAV_ITEMS = [
  { label: '文章', href: '/posts' },
  { label: '系列', href: '/series' },
  { label: '标签', href: '/tags' },
  { label: '归档', href: '/archive' },
  { label: '关于', href: '/about' }
] as const;

export function withBase(path: string) {
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}` || '/';
}
