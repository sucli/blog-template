import { access, readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';
import { resolveSiteBase } from './site-base.mjs';

const root = new URL('../dist/', import.meta.url);
const rootPath = fileURLToPath(root);
const basePath = resolveSiteBase().replace(/^\/+|\/+$/g, '');
const htmlFiles = [];

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else if (entry.name.endsWith('.html')) htmlFiles.push(path);
  }
}

function attributes(node) {
  const values = [];
  const attrs = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
  if (attrs.href) values.push(attrs.href);
  if (attrs.src) values.push(attrs.src);
  for (const child of node.childNodes ?? []) values.push(...attributes(child));
  return values;
}

async function exists(pathname) {
  let clean = decodeURIComponent(pathname).replace(/^\/+/, '');
  if (basePath && (clean === basePath || clean.startsWith(`${basePath}/`))) {
    clean = clean.slice(basePath.length).replace(/^\/+/, '');
  }
  const direct = join(rootPath, clean);
  const candidates = extname(clean)
    ? [direct]
    : [direct, join(direct, 'index.html'), `${direct}.html`];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return true;
    } catch {}
  }
  return false;
}

await collect(rootPath);
const failures = [];

for (const file of htmlFiles) {
  const document = parse(await readFile(file, 'utf8'));
  const pagePath = `/${relative(rootPath, file).replace(/index\.html$/, '')}`;
  for (const value of attributes(document)) {
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(value)) continue;
    const url = new URL(value, `https://local.test${pagePath}`);
    if (!(await exists(url.pathname))) failures.push(`${relative(rootPath, file)} -> ${value}`);
  }
}

if (failures.length > 0) {
  console.error(`发现 ${failures.length} 个无效内部链接：\n${[...new Set(failures)].join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`已检查 ${htmlFiles.length} 个 HTML 文件，内部链接和资源均有效。`);
}
