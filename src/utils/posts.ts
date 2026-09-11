import type { CollectionEntry } from 'astro:content';
import { SITE } from '../config';

export type Post = CollectionEntry<'posts'>;

export function sortPosts(posts: Post[]) {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

interface VisibilityOptions {
  includeUnpublished?: boolean;
  now?: Date;
}

export function visiblePosts(
  posts: Post[],
  { includeUnpublished = import.meta.env.DEV, now = new Date() }: VisibilityOptions = {}
) {
  return sortPosts(posts.filter((post) => includeUnpublished || (!post.data.draft && post.data.pubDate <= now)));
}

export function getReadingTime(post: Post) {
  const content = 'body' in post && typeof post.body === 'string' ? post.body : '';
  const latinWords = content.match(/[a-zA-Z0-9]+/g)?.length ?? 0;
  const chineseCharacters = content.match(/[㐀-鿿]/g)?.length ?? 0;
  return Math.max(1, Math.ceil((latinWords + chineseCharacters / 2) / 220));
}

/** Strip Markdown/MDX noise so the text can be used in the client search index. */
export function postBodyText(post: Post, maxLength = 4000) {
  const content = 'body' in post && typeof post.body === 'string' ? post.body : '';
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s*(import|export)\s.+$/gm, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, ' ')
    .replace(/^\s*>\s?/gm, ' ')
    .replace(/\*\*|__|~~/g, '')
    .replace(/[*_~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat(SITE.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}

export function formatMonthDay(date: Date) {
  return new Intl.DateTimeFormat(SITE.locale, {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}

export function getAllTags(posts: Post[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, SITE.locale));
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

export function getSeries(posts: Post[]) {
  const series = new Map<string, Post[]>();
  for (const post of posts) {
    const name = post.data.series;
    if (!name) continue;
    const entries = series.get(name) ?? [];
    entries.push(post);
    series.set(name, entries);
  }

  return [...series.entries()]
    .map(([name, entries]) => ({
      name,
      posts: [...entries].sort((a, b) => {
        const aOrder = a.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
        const bOrder = b.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
        return aOrder - bOrder || a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
      })
    }))
    .sort((a, b) => a.name.localeCompare(b.name, SITE.locale));
}

export function seriesToSlug(series: string) {
  return tagToSlug(series);
}

function normalizeTag(tag: string) {
  return tag.trim().normalize('NFKC').toLocaleLowerCase();
}

/** Rank other posts by shared tags, with a small boost for the same series. */
export function getRelatedPosts(post: Post, posts: Post[], limit = 3) {
  const currentTags = new Set(post.data.tags.map(normalizeTag));
  return posts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => {
      const shared = candidate.data.tags.filter((tag) => currentTags.has(normalizeTag(tag))).length;
      const seriesBoost = post.data.series && candidate.data.series === post.data.series ? 1 : 0;
      return { candidate, score: shared * 2 + seriesBoost };
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.candidate.data.pubDate.valueOf() - a.candidate.data.pubDate.valueOf()
    )
    .slice(0, limit)
    .map((item) => item.candidate);
}
