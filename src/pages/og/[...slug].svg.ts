import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { visiblePosts } from '../../utils/posts';
import { SITE } from '../../config';

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '\"': '&quot;' })[character] ?? character);
}

function splitTitle(title: string, maxLength = 22) {
  const lines: string[] = [];
  let line = '';
  for (const character of title) {
    if (line.length >= maxLength) { lines.push(line); line = ''; }
    line += character;
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

export async function getStaticPaths() {
  return visiblePosts(await getCollection('posts')).map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute = ({ props }) => {
  const post = props.post;
  const title = splitTitle(post.data.title).map((line, index) => `<text x="88" y="${210 + index * 66}" class="title">${escapeXml(line)}</text>`).join('');
  const description = escapeXml(post.data.description.slice(0, 72));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f7f7f2"/><rect x="48" y="48" width="1104" height="534" rx="28" fill="#dfe9e2"/><circle cx="1030" cy="120" r="120" fill="#435c4d" opacity=".12"/><circle cx="1090" cy="530" r="180" fill="#435c4d" opacity=".1"/><text x="88" y="112" class="brand">${escapeXml(SITE.title)}</text>${title}<text x="88" y="430" class="description">${description}</text><text x="88" y="520" class="author">${escapeXml(SITE.author)}</text><style>.brand{fill:#435c4d;font:700 28px Arial,sans-serif;letter-spacing:2px}.title{fill:#171a18;font:700 52px Arial,'PingFang SC',sans-serif}.description{fill:#686e69;font:24px Arial,'PingFang SC',sans-serif}.author{fill:#435c4d;font:600 22px Arial,'PingFang SC',sans-serif}</style></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=31536000, immutable' } });
};
