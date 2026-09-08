import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const pagefindCli = join(process.cwd(), 'node_modules', 'pagefind', 'bin', 'pagefind.js');
try {
  await access(pagefindCli);
} catch {
  console.log('Pagefind 未安装，保留内置搜索索引。安装 pagefind 后可生成增强索引。');
  process.exit(0);
}

await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [pagefindCli, '--site', 'dist'], { stdio: 'inherit' });
  child.on('error', reject);
  child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Pagefind exited with code ${code}`)));
});
