export const SITE = {
  title: 'Paperwind',
  description: '记录技术、创作与日常思考的独立博客。',
  author: 'Your Name',
  email: 'hello@example.com',
  locale: 'zh-CN',
  postsPerPage: 9,
  social: {
    github: 'https://github.com/your-name',
    x: 'https://x.com/your-name'
  }
} as const;

export const NAV_ITEMS = [
  { label: '文章', href: '/posts' },
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
