import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? '';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const isUserSite = repository === `${owner}.github.io`;
const base = process.env.BASE_PATH ?? (isGitHubPages && !isUserSite ? `/${repository}` : '/');
const site = process.env.SITE_URL ?? (isGitHubPages ? `https://${owner}.github.io` : 'https://example.com');

export default defineConfig({
  site,
  base,
  trailingSlash: 'never',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true
    }
  }
});
