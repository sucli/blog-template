# Paperwind Blog Template

一个专注于内容、速度和可部署性的开源博客模板。基于 Astro、TypeScript 与 Markdown/MDX，无数据库、无后台服务，适合个人博客、技术专栏和团队日志。

## 特性

- Markdown / MDX 写作与类型安全的文章元数据
- 响应式设计、深色模式和无 JavaScript 基础阅读体验
- 首页、文章列表、标签、归档、搜索、关于与 404 页面
- 可配置的静态文章分页
- RSS、Sitemap、Open Graph、Canonical URL 和结构化数据
- GitHub Pages 自动部署工作流
- 同样可部署到 Vercel、Netlify、Cloudflare Pages 等静态托管平台

## 快速开始

```bash
npm install
npm run dev
```

访问 `http://localhost:4321`。

## 创建你的博客

1. 在 GitHub 仓库页面点击 **Use this template**。
2. 修改 `src/config.ts` 中的网站名称、作者、简介和社交链接。
3. 删除 `src/content/posts` 中的示例文章，添加自己的 `.md` 或 `.mdx` 文件。
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
draft: false
---

从这里开始写正文。
```

`draft: true` 的文章不会出现在生产构建中，但开发环境仍然可见。

每页文章数量可以通过 `src/config.ts` 中的 `postsPerPage` 调整。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 类型检查并生成生产站点 |
| `npm run preview` | 本地预览生产构建 |
| `npm run check` | 检查 Astro 与 TypeScript |

## 部署

### GitHub Pages

仓库已经包含 `.github/workflows/deploy.yml`。工作流会自动识别仓库子路径，无需手动修改 `base`。

### Vercel / Netlify / Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: `22`
- 环境变量 `SITE_URL`: 你的生产域名
- 环境变量 `BASE_PATH`: `/`

## 目录结构

```text
src/
├── components/       可复用组件
├── content/posts/    Markdown / MDX 文章
├── layouts/          页面与文章布局
├── pages/            文件路由
├── styles/           全局样式
├── content.config.ts 内容模型
└── config.ts         网站配置
```

## License

[MIT](./LICENSE)
