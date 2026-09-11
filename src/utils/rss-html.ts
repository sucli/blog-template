import { marked } from 'marked';

function stripMdx(source: string) {
  return source
    .replace(/^\s*import\s.+$/gm, '')
    .replace(/^\s*export\s.+$/gm, '')
    .replace(/<\/?[A-Z][\w.]*(\s[^>]*)?>/g, '');
}

/** Convert post body to HTML for RSS, rewriting root-relative URLs to absolute. */
export function markdownToRssHtml(body: string, site: URL, basePath: string) {
  const cleaned = stripMdx(body);
  const html = typeof marked.parse(cleaned) === 'string'
    ? (marked.parse(cleaned) as string)
    : '';
  const origin = new URL(basePath.replace(/\/$/, '') + '/', site).href;
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${origin}`);
}
