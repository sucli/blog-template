import { describe, expect, it } from 'vitest';
import type { Post } from '../src/utils/posts';
import {
  formatDate,
  formatMonthDay,
  getAllTags,
  getRelatedPosts,
  getSeries,
  postBodyText,
  tagToSlug,
  visiblePosts
} from '../src/utils/posts';
import { markdownToRssHtml } from '../src/utils/rss-html';

function post(id: string, pubDate: string, options: { draft?: boolean; tags?: string[]; series?: string; seriesOrder?: number; body?: string } = {}) {
  return {
    id,
    body: options.body,
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

  it('extracts searchable plain text from markdown bodies', () => {
    const sample = post('sample', '2026-01-01', {
      body: 'import Callout from "./x";\n\n## 标题\n\n这是一段**正文**，包含[链接](/posts/other)和`代码`。\n\n```ts\nconst secret = "skip";\n```\n'
    });
    const text = postBodyText(sample);
    expect(text).toContain('这是一段正文');
    expect(text).toContain('链接');
    expect(text).not.toContain('secret');
    expect(text).not.toContain('import');
  });

  it('ranks related posts by shared tags and series boost', () => {
    const current = post('current', '2026-03-01', { tags: ['Astro', '写作'], series: 'Astro 实践' });
    const posts = [
      current,
      post('same-series', '2026-02-01', { tags: ['其他'], series: 'Astro 实践' }),
      post('shared-two', '2026-01-01', { tags: ['Astro', '写作'] }),
      post('shared-one', '2026-01-02', { tags: ['Astro'] }),
      post('unrelated', '2026-01-03', { tags: ['生活'] })
    ];
    expect(getRelatedPosts(current, posts, 3).map(({ id }) => id)).toEqual([
      'shared-two',
      'shared-one',
      'same-series'
    ]);
  });
});

describe('rss html', () => {
  it('rewrites root-relative links against site origin and base path', () => {
    const html = markdownToRssHtml('阅读 [文章](/posts/other) 与 ![图](/covers/a.png)', new URL('https://example.com'), '/blog');
    expect(html).toContain('href="https://example.com/blog/posts/other"');
    expect(html).toContain('src="https://example.com/blog/covers/a.png"');
  });
});
