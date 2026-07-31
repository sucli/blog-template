---
title: 用 GitHub Pages 自动发布博客
description: 从模板仓库到公开网站，一次推送即可完成构建与部署。
pubDate: 2026-07-18
tags: [部署, GitHub, CI/CD]
cover: /covers/deploy.png
coverAlt: 表示代码自动流向网页的抽象图形
---

Paperwind 已经准备好 GitHub Actions 工作流。你不需要购买服务器，也不必手工上传构建文件。

## 第一次发布

1. 在模板仓库顶部点击 **Use this template**，创建自己的仓库。
2. 将仓库克隆到本地，修改 `src/config.ts`。
3. 提交代码并推送到 `main` 分支。
4. 打开仓库的 **Settings → Pages**。
5. 在 Build and deployment 中选择 **GitHub Actions**。

工作流会安装依赖、运行类型检查、构建静态站点，再把生成的 `dist` 目录发布到 Pages。

## 项目站点与用户站点

GitHub Pages 有两种常见地址：

- 用户站点：`https://username.github.io`
- 项目站点：`https://username.github.io/repository`

模板会从 GitHub 提供的信息中读取正确的站点根路径，因此项目站点里的图片、文章链接和 RSS 也能正常工作。

## 使用自定义域名

如果你绑定了自己的域名，可以在仓库环境变量中设置 `SITE_URL`。生产环境的 canonical URL、Sitemap 和社交分享地址会使用这个域名。

部署完成后，建议检查首页、任意文章、RSS 地址和 404 页面，确认所有链接都符合预期。
