import type { CollectionEntry } from 'astro:content';
import { SITE } from '../config';

export type Post = CollectionEntry<'posts'>;

export function sortPosts(posts: Post[]) {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function visiblePosts(posts: Post[]) {
  return sortPosts(posts.filter((post) => import.meta.env.DEV || !post.data.draft));
}

export function getReadingTime(post: Post) {
  const content = 'body' in post && typeof post.body === 'string' ? post.body : '';
  const latinWords = content.match(/[a-zA-Z0-9]+/g)?.length ?? 0;
  const chineseCharacters = content.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  return Math.max(1, Math.ceil((latinWords + chineseCharacters / 2) / 220));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat(SITE.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function getAllTags(posts: Post[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}

export function tagToSlug(tag: string) {
  const normalized = tag.trim().normalize('NFKC');
  const readable = normalized
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'tag';

  let hash = 2166136261;
  for (let index = 0; index < normalized.length; index++) {
    hash ^= normalized.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `${readable}-${(hash >>> 0).toString(36)}`;
}
