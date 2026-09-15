# Paperwind Blog Template

<p align="center">
  <strong>An open-source Astro blog template focused on content, speed, and deployability</strong>
</p>

<p align="center">
  Markdown / MDX · TypeScript · No database · SEO & RSS out of the box
</p>

<p align="center">
  <a href="./README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <a href="https://github.com/sucli/blog-template/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-435c4d"></a>
  <a href="https://astro.build"><img alt="Astro 7" src="https://img.shields.io/badge/Astro-7-ff5d01"></a>
  <img alt="Node >= 22.19" src="https://img.shields.io/badge/Node-%3E%3D%2022.19-339933">
  <a href="https://github.com/sucli/blog-template/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/sucli/blog-template/actions/workflows/ci.yml/badge.svg"></a>
</p>

A blog template for independent writers and developers: no database, no admin backend. Every post lives as Markdown in your Git repository.

## Features

- Markdown / MDX writing with type-safe frontmatter
- Responsive layout, dark mode, skip link, and a near-zero-JS reading experience
- Home, posts, series, tags, archive, search, about, and 404 pages
- Site nav, social links, about copy, optional comments, and related posts in `site.config.json`
- Configurable static pagination
- Table of contents, prev/next posts, series navigation, scheduled publishing, and updated dates
- Client search over title, description, tags, series, and body text
- Full-content RSS, Sitemap, PNG Open Graph images, and JSON-LD
- Optional Giscus comments
- Tag-overlap related posts on each article
- GitHub Pages workflow; works with Vercel / Netlify / Cloudflare Pages too

## Quick start

```bash
npm install
npm run init
npm run dev
```

Open `http://localhost:4321`.

### Create your blog

1. Click **Use this template** on GitHub.
2. Run `npm run init` to set title, author, domain, nav, and social links. About copy lives under `about` in `site.config.json`.
3. Add `.md` or `.mdx` files under `src/content/posts`.
4. Push to `main`.
5. In the repo **Settings → Pages → Build and deployment**, choose **GitHub Actions**.

Post format:

```md
---
title: My first post
description: One-line summary for lists and SEO.
pubDate: 2026-07-31
tags: [Astro, Blog]
cover: /covers/welcome.png
coverAlt: Describe the cover image
series: Building with Astro
seriesOrder: 1
draft: false
---

Start writing here.
```

- `draft: true` hides the post from production builds but keeps it visible in dev.
- Future `pubDate` values are treated as scheduled posts.
- Optional `updatedDate` shows a “last updated” line.
- `series` + `seriesOrder` power series index pages and in-series navigation.
- Posts without a cover fall back to a letter mark on cards.

MDX posts can use the built-in callout:

```mdx
import Callout from '../../components/Callout.astro';

<Callout type="tip" title="Reading tip">
  Put a short note here.
</Callout>
```

Code blocks get a copy button automatically.

### Site configuration

`site.config.json` holds site identity, nav, social links, comments, related posts, about copy, and pagination:

```json
{
  "title": "Paperwind",
  "description": "An independent blog about tech, craft, and daily notes.",
  "author": "Your Name",
  "email": "hello@example.com",
  "locale": "en-US",
  "siteUrl": "https://example.com",
  "postsPerPage": 9,
  "nav": [
    { "label": "Posts", "href": "/posts" },
    { "label": "About", "href": "/about" }
  ],
  "social": {
    "github": "https://github.com/your-name",
    "x": "https://x.com/your-name",
    "weibo": "",
    "zhihu": "",
    "bilibili": "",
    "juejin": ""
  },
  "comments": {
    "enabled": false,
    "repo": "",
    "repoId": "",
    "category": "",
    "categoryId": "",
    "mapping": "pathname",
    "theme": "preferred_color_scheme"
  },
  "relatedPosts": {
    "enabled": true,
    "limit": 3
  },
  "about": {
    "intro": "Welcome to {title}. …",
    "sections": [
      { "title": "Why write", "body": "…" },
      { "title": "Contact", "body": "Email me at {email}." }
    ]
  }
}
```

About text supports `{title}`, `{author}`, and `{email}` placeholders. Empty social links are hidden automatically.

### Optional Giscus comments

1. Install and authorize [Giscus](https://giscus.app) for your repository.
2. Copy `repo`, `repoId`, `category`, and `categoryId` from the site.
3. Set `comments.enabled` to `true` in `site.config.json`.

Comments render on post pages only and stay disabled until you enable them.

### Related posts

Enabled by default. Posts are ranked by shared tags (same-series posts get a small boost). Tune `relatedPosts.limit` or set `enabled: false`.

## Math and diagrams

Paperwind ships without KaTeX or Mermaid so the default bundle stays small. Add them only if you need them.

### KaTeX (MDX)

```bash
npm install remark-math rehype-katex katex
```

```js
// astro.config.mjs
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  }
});
```

Import KaTeX CSS once in `src/layouts/BaseLayout.astro`:

```astro
import 'katex/dist/katex.min.css';
```

Then write `$E = mc^2$` or `$$…$$` blocks in Markdown/MDX.

### Mermaid (MDX)

Prefer rendering Mermaid as an Astro component so diagrams stay static HTML:

```bash
npm install mermaid
```

Create `src/components/Mermaid.astro` that mounts Mermaid client-side on a `pre.mermaid` block, then use it from MDX:

```mdx
import Mermaid from '../../components/Mermaid.astro';

<Mermaid chart={`graph TD
  A[Write] --> B[Build]
  B --> C[Publish]`} />
```

Alternatively, use `astro-mermaid` or a remark plugin if you want fenced ` ```mermaid ` blocks processed automatically.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run init` | Interactively set up site identity and sample content |
| `npm run build` | Type-check and build the production site |
| `npm run preview` | Preview the production build |
| `npm run check` | Run Astro + TypeScript checks |
| `npm run test` | Run unit tests |
| `npm run validate` | Tests, build, search indexing, and link checks |

Search uses the built-in JSON index (title, description, tags, series, body). To also emit Pagefind assets:

```bash
npm install -D pagefind
npm run validate
```

The search page still uses the built-in index by default; wire Pagefind in yourself if you want its full-text engine.

Social share images prefer the post cover PNG, then fall back to `public/og-default.png`. `/og/{slug}.svg` remains available as a lightweight preview asset.

## Deploy

### GitHub Pages

`.github/workflows/deploy.yml` is included. It detects repository subpaths automatically — no manual `base` edits.

### Vercel / Netlify / Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: `22.19.0` or newer
- `SITE_URL`: production origin
- `BASE_PATH`: `/`

## Project layout

```text
src/
├── components/       reusable UI (header, footer, comments, callout…)
├── content/posts/    Markdown / MDX posts
├── layouts/          page and post layouts
├── pages/            file-based routes
├── styles/           global CSS
├── utils/            post and RSS helpers
├── content.config.ts content model
└── config.ts         site config helpers
site.config.json      identity, nav, social, comments, related posts, about
```

Run `npm run validate` before opening a PR.

## License

[MIT](./LICENSE)
