import { describe, expect, it } from 'vitest';
import type { Post } from '../src/utils/posts';
import { formatDate, formatMonthDay, getAllTags, getSeries, tagToSlug, visiblePosts } from '../src/utils/posts';

function post(id: string, pubDate: string, options: { draft?: boolean; tags?: string[]; series?: string; seriesOrder?: number } = {}) {
  return {
    id,
    data: {
      title: id,
      description: id,
      pubDate: new Date(pubDate),
      tags: options.tags ?? [],
      series: options.series,
      seriesOrder: options.seriesOrder,
      draft: options.draft ?? false,
      featured: false
    }
  } as Post;
}

describe('post utilities', () => {
  it('formats date-only values in UTC', () => {
    const date = new Date('2026-01-01');
    expect(formatDate(date)).toBe('2026年1月1日');
    expect(formatMonthDay(date)).toBe('1月1日');
  });

  it('hides drafts and scheduled posts in production', () => {
    const posts = [
      post('published', '2026-01-01'),
      post('scheduled', '2026-03-01'),
      post('draft', '2025-12-01', { draft: true })
    ];
    expect(visiblePosts(posts, { includeUnpublished: false, now: new Date('2026-02-01') }).map(({ id }) => id)).toEqual(['published']);
  });

  it('keeps tag slugs stable and sorts tag counts by locale', () => {
    const posts = [post('one', '2026-01-01', { tags: ['博客', 'Astro'] }), post('two', '2026-01-02', { tags: ['博客'] })];
    expect(tagToSlug(' Astro ')).toBe('astro-lan7e4');
    expect(getAllTags(posts)).toEqual([
      { name: '博客', count: 2 },
      { name: 'Astro', count: 1 }
    ]);
  });

  it('groups and orders article series', () => {
    const posts = [
      post('second', '2026-01-02', { series: 'Astro', seriesOrder: 2 }),
      post('first', '2026-01-01', { series: 'Astro', seriesOrder: 1 }),
      post('other', '2026-01-03', { series: 'Other', seriesOrder: 1 })
    ];
    expect(getSeries(posts).map(({ name, posts: entries }) => [name, entries.map(({ id }) => id)])).toEqual([
      ['Astro', ['first', 'second']],
      ['Other', ['other']]
    ]);
  });
});
