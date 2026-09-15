import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import siteConfig from './site.config.json' with { type: 'json' };
import { resolveSiteBase } from './scripts/site-base.mjs';

const owner = process.env.GITHUB_REPOSITORY_OWNER ?? '';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const base = resolveSiteBase();
const site = process.env.SITE_URL ?? (isGitHubPages ? `https://${owner}.github.io` : siteConfig.siteUrl);

export default defineConfig({
  site,
  base,
  trailingSlash: 'never',
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !new URL(page).pathname.endsWith('/search') })
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true
    }
  }
});
