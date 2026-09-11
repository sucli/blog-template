import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, withBase } from '../config';
import { markdownToRssHtml } from '../utils/rss-html';
import { visiblePosts } from '../utils/posts';

export async function GET(context: { site: URL }) {
  const posts = visiblePosts(await getCollection('posts'));
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: new URL(withBase('/'), context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: withBase(`/posts/${post.id}`),
      categories: post.data.tags,
      content: markdownToRssHtml(post.body ?? '', context.site, basePath)
    })),
    customData: `<language>${SITE.locale}</language>`
  });
}
