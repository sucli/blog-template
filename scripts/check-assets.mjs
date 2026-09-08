import { access, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const postsRoot = new URL('../src/content/posts/', import.meta.url);
async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = new URL(entry.name, directory);
    if (entry.isDirectory()) files.push(...await collect(new URL(`${entry.name}/`, directory)));
    else files.push({ entry, path });
  }
  return files;
}

const files = await collect(postsRoot);
const failures = [];
const seriesOrders = new Map();

function pngDimensions(buffer) {
  if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

for (const { entry, path } of files) {
  if (!entry.isFile() || !/\.(md|mdx)$/.test(entry.name)) continue;
  const source = await readFile(path, 'utf8');
  const cover = source.match(/^cover:\s*["']?([^"'\n]+)["']?\s*$/m)?.[1]?.trim();
  if (!cover) continue;
  const coverAlt = source.match(/^coverAlt:\s*["']?([^"'\n]+)["']?\s*$/m)?.[1]?.trim();
  if (!coverAlt) failures.push(`${entry.name}: coverAlt is required when cover is set`);
  const assetPath = join(root.pathname, 'public', cover.replace(/^\//, ''));
  try {
    await access(assetPath);
    const dimensions = pngDimensions(await readFile(assetPath));
    if (dimensions && (dimensions.width < 800 || dimensions.height < 400)) failures.push(`${entry.name}: cover must be at least 800x400 (${dimensions.width}x${dimensions.height})`);
  } catch { failures.push(`${entry.name}: missing cover asset ${cover}`); }

  const series = source.match(/^series:\s*["']?([^"'\n]+)["']?\s*$/m)?.[1]?.trim();
  const orderValue = source.match(/^seriesOrder:\s*(\d+)\s*$/m)?.[1];
  if (series && orderValue) {
    const order = Number(orderValue);
    const orders = seriesOrders.get(series) ?? new Map();
    if (orders.has(order)) failures.push(`${entry.name}: duplicate seriesOrder ${order} in series "${series}" (already used by ${orders.get(order)})`);
    orders.set(order, entry.name);
    seriesOrders.set(series, orders);
  }
}

if (failures.length) { console.error(`资源校验失败：\n${failures.join('\n')}`); process.exitCode = 1; }
else console.log('文章封面资源校验通过。');
