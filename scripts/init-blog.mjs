import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const root = new URL('..', import.meta.url);
const configPath = new URL('site.config.json', root);
const postsPath = new URL('src/content/posts/', root);
const current = JSON.parse(await readFile(configPath, 'utf8'));
const prompt = createInterface({ input, output });

const ask = async (label, fallback) => {
  const answer = (await prompt.question(`${label} (${fallback}): `)).trim();
  return answer || fallback;
};

const askOptional = async (label, fallback) => {
  const answer = (await prompt.question(`${label} (${fallback || '未设置'}，输入 - 可清空): `)).trim();
  return answer === '-' ? '' : answer || fallback;
};

try {
  const next = {
    ...current,
    title: await ask('站点名称', current.title),
    description: await ask('站点简介', current.description),
    author: await ask('作者名称', current.author),
    email: await ask('联系邮箱', current.email),
    locale: await ask('语言区域', current.locale),
    siteUrl: await ask('站点 URL', current.siteUrl),
    social: {
      ...current.social,
      github: await askOptional('GitHub 链接', current.social.github),
      x: await askOptional('X 链接', current.social.x)
    }
  };

  new URL(next.siteUrl);
  await writeFile(configPath, `${JSON.stringify(next, null, 2)}\n`);

  const clearExamples = (await prompt.question('删除所有示例文章？[y/N]: ')).trim().toLocaleLowerCase();
  if (clearExamples === 'y' || clearExamples === 'yes') {
    for (const entry of await readdir(postsPath)) {
      await rm(new URL(entry, postsPath), { recursive: true, force: true });
    }
    await mkdir(postsPath, { recursive: true });
  }

  output.write('博客配置已更新。\n');
} finally {
  prompt.close();
}
