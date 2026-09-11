import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, withBase } from '../config';
import { formatDate, postBodyText, visiblePosts } from '../utils/posts';

export const GET: APIRoute = async () => {
  const posts = visiblePosts(await getCollection('posts')).map((post) => ({
    title: post.data.title,
    description: post.data.description,
    date: formatDate(post.data.pubDate),
    href: withBase(`/posts/${post.id}`),
    search: `${post.data.title} ${post.data.description} ${post.data.tags.join(' ')} ${post.data.series ?? ''} ${postBodyText(post)}`
      .toLocaleLowerCase(SITE.locale)
      .replace(/\s+/g, ' ')
      .trim()
  }));

  return new Response(JSON.stringify(posts), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate'
    }
  });
};
