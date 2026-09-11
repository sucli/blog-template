# Paperwind Blog Template

<p align="center">
  <strong>专注内容、速度与可部署性的开源 Astro 博客模板</strong>
</p>

<p align="center">
  Markdown / MDX · TypeScript · 零数据库 · 开箱即用的 SEO 与 RSS
</p>

<p align="center">
  <a href="./README.md">English</a>
</p>

<p align="center">
  <a href="https://github.com/sucli/blog-template/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-435c4d"></a>
  <a href="https://astro.build"><img alt="Astro 7" src="https://img.shields.io/badge/Astro-7-ff5d01"></a>
  <img alt="Node >= 22.12" src="https://img.shields.io/badge/Node-%3E%3D%2022.12-339933">
  <a href="https://github.com/sucli/blog-template/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/sucli/blog-template/actions/workflows/ci.yml/badge.svg"></a>
</p>

一个为独立写作者和开发者准备的博客模板：没有数据库，没有复杂的后台，所有内容都在 Git 仓库里的 Markdown 文件中。

## 特性

- Markdown / MDX 写作与类型安全的文章元数据
- 响应式设计、深色模式、跳过导航链接，以及接近无 JavaScript 的基础阅读体验
- 首页、文章列表、系列、标签、归档、搜索、关于与 404 页面
- 站点导航、社交链接、关于页、可选评论与相关文章集中在 `site.config.json`
- 可配置的静态文章分页
- 文章目录、相邻文章导航、系列上下篇、定时发布与更新时间
- 无封面文章自动使用首字母封面占位
- 搜索索引覆盖标题、摘要、标签与正文关键词
- RSS 输出摘要与全文 HTML，另有 Sitemap、Open Graph（PNG）与结构化数据
- 可选 Giscus 评论；按标签重叠推荐相关文章
- GitHub Pages 自动部署工作流，也可部署到 Vercel / Netlify / Cloudflare Pages

## 快速开始

```bash
npm install
npm run init
npm run dev
```

访问 `http://localhost:4321`。

### 创建你的博客

1. 在 GitHub 仓库页面点击 **Use this template**。
2. 运行 `npm run init`，填写网站名称、作者、域名、导航与社交链接；关于页文案在 `site.config.json` 的 `about` 字段。
3. 在 `src/content/posts` 中添加自己的 `.md` 或 `.mdx` 文件。
4. 将代码推送到 `main` 分支。
5. 在 GitHub 仓库的 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。

文章格式：

```md
---
title: 我的第一篇文章
description: 一句话摘要，用于列表与 SEO。
pubDate: 2026-07-31
tags: [Astro, 博客]
cover: /covers/welcome.png
coverAlt: 描述封面内容的替代文本
series: Astro 内容网站实践
seriesOrder: 1
draft: false
---

从这里开始写正文。
```

- `draft: true`：生产构建隐藏，开发环境仍可见
- 未来 `pubDate`：视为定时文章
- `updatedDate`：文章页显示最近更新时间
- `series` + `seriesOrder`：生成系列索引与上下篇导航
- 未设置封面时，列表卡片会显示标题首字母占位

MDX 文章可以使用内置提示框：

```mdx
import Callout from '../../components/Callout.astro';

<Callout type="tip" title="阅读建议">
  这里放一段提示内容。
</Callout>
```

文章中的代码块会自动显示复制按钮。

### 站点配置

`site.config.json` 集中管理站点资料、导航、社交、评论、相关文章、关于页与分页：

```json
{
  "title": "Paperwind",
  "description": "记录技术、创作与日常思考的独立博客。",
  "author": "Your Name",
  "email": "hello@example.com",
  "locale": "zh-CN",
  "siteUrl": "https://example.com",
  "postsPerPage": 9,
  "nav": [
    { "label": "文章", "href": "/posts" },
    { "label": "关于", "href": "/about" }
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
    "intro": "欢迎来到 {title}。……",
    "sections": [
      { "title": "为什么写作", "body": "……" },
      { "title": "联系我", "body": "…… {email}。" }
    ]
  }
}
```

关于页文案支持 `{title}`、`{author}`、`{email}` 占位符。未填写的社交链接会自动隐藏。

### 可选 Giscus 评论

1. 在 [giscus.app](https://giscus.app) 安装并授权你的仓库。
2. 把 `repo`、`repoId`、`category`、`categoryId` 填入配置。
3. 将 `comments.enabled` 设为 `true`。

评论只渲染在文章页，默认关闭。

### 相关文章

默认开启：按共享标签数量排序，同系列文章有额外加权。可通过 `relatedPosts.limit` 调整数量，或设 `enabled: false` 关闭。

## 数学公式与图表

模板默认不打包 KaTeX / Mermaid，以保持体积精简。需要时按下面接入。

### KaTeX（MDX）

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

在 `src/layouts/BaseLayout.astro` 中引入样式：

```astro
import 'katex/dist/katex.min.css';
```

之后即可在 Markdown/MDX 中写 `$E = mc^2$` 或 `$$…$$`。

### Mermaid（MDX）

推荐用 Astro 组件在构建时渲染，输出仍是静态 HTML：

```bash
npm install mermaid
```

新建 `src/components/Mermaid.astro`，在客户端对图表节点初始化 Mermaid，然后在 MDX 中使用：

```mdx
import Mermaid from '../../components/Mermaid.astro';

<Mermaid chart={`graph TD
  A[写作] --> B[构建]
  B --> C[发布]`} />
```

也可以使用 `astro-mermaid` 或 remark 插件，让 ` ```mermaid ` 代码块自动处理。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run init` | 交互式初始化博客资料与示例内容 |
| `npm run build` | 类型检查并生成生产站点 |
| `npm run preview` | 本地预览生产构建 |
| `npm run check` | 检查 Astro 与 TypeScript |
| `npm run test` | 运行工具函数测试 |
| `npm run validate` | 执行测试、构建与内部链接检查 |

搜索默认使用内置 JSON 索引（标题、摘要、标签、系列与正文）。若还需要 Pagefind 的全文检索产物，可执行 `npm install -D pagefind`；之后 `npm run validate` 会在构建后生成 Pagefind 索引资源。当前搜索页仍使用内置索引，Pagefind 资源可按需自行接入。

社交分享图优先使用文章封面 PNG，否则回退到 `public/og-default.png`。站点另提供 `/og/{slug}.svg` 动态矢量预览图，便于站内展示；多数社交平台请以 PNG 为准。

## 部署

### GitHub Pages

仓库已经包含 `.github/workflows/deploy.yml`。工作流会自动识别仓库子路径，无需手动修改 `base`。

### Vercel / Netlify / Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: `22.12.0` 或更高版本
- 环境变量 `SITE_URL`: 你的生产域名
- 环境变量 `BASE_PATH`: `/`

## 目录结构

```text
src/
├── components/       可复用组件（含可选 Comments）
├── content/posts/    Markdown / MDX 文章
├── layouts/          页面与文章布局
├── pages/            文件路由
├── styles/           全局样式
├── utils/            文章与 RSS 工具
├── content.config.ts 内容模型
└── config.ts         配置读取与路径工具
site.config.json      站点资料、导航、社交、评论、相关文章与关于页
```

提交改动前建议运行 `npm run validate`。该命令会依次执行工具函数测试、类型检查、生产构建和内部链接检查。

## License

[MIT](./LICENSE)
