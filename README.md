# Paperwind Blog Template

一个专注于内容、速度和可部署性的开源博客模板。基于 Astro、TypeScript 与 Markdown/MDX，无数据库、无后台服务，适合个人博客、技术专栏和团队日志。

## 特性

- Markdown / MDX 写作与类型安全的文章元数据
- 响应式设计、深色模式和无 JavaScript 基础阅读体验
- 首页、文章列表、标签、归档、搜索、关于与 404 页面
- 可配置的静态文章分页
- 文章目录、相邻文章导航、定时发布与更新时间
- 独立搜索索引，不把全部文章内容塞入搜索页 HTML
- 可选 Pagefind 搜索增强，未安装时自动使用内置轻量搜索
- RSS、Sitemap、Open Graph、Canonical URL 和结构化数据
- GitHub Pages 自动部署工作流
- 同样可部署到 Vercel、Netlify、Cloudflare Pages 等静态托管平台

## 快速开始

```bash
npm install
npm run init
npm run dev
```

访问 `http://localhost:4321`。

## 创建你的博客

1. 在 GitHub 仓库页面点击 **Use this template**。
2. 运行 `npm run init`，填写网站名称、作者、域名和社交链接。
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

`draft: true` 的文章不会出现在生产构建中，但开发环境仍然可见。
发布日期晚于构建时间的文章会被视为定时文章，只在到达发布日期后进入生产构建。设置 `updatedDate` 后，文章页会显示最近更新时间。
设置 `series` 和 `seriesOrder` 可以将文章编排为系列，模板会生成系列索引、系列详情页和上一篇/下一篇导航。

MDX 文章可以使用内置提示框：

```mdx
import Callout from '../../components/Callout.astro';

<Callout type="tip" title="阅读建议">
  这里放一段提示内容。
</Callout>
```

文章中的代码块会自动显示复制按钮。

站点资料和每页文章数量保存在根目录的 `site.config.json`。

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

搜索默认使用内置 JSON 索引。若需要 Pagefind 的全文检索能力，可执行 `npm install -D pagefind`，之后 `npm run validate` 会在构建后自动生成 Pagefind 索引资源。

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
├── components/       可复用组件
├── content/posts/    Markdown / MDX 文章
├── layouts/          页面与文章布局
├── pages/            文件路由
├── styles/           全局样式
├── content.config.ts 内容模型
└── config.ts         配置读取与路径工具
site.config.json      网站资料与分页配置
```

提交改动前建议运行 `npm run validate`。该命令会依次执行工具函数测试、类型检查、生产构建和内部链接检查。

## License

[MIT](./LICENSE)
