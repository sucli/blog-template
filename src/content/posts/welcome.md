---
title: 欢迎来到 Paperwind
description: 认识这个轻量、快速且专注于写作体验的 Astro 博客模板。
pubDate: 2026-07-31
tags: [博客, Astro, 开源]
cover: /covers/welcome.png
coverAlt: 抽象的纸张与绿叶图形
featured: true
---

欢迎来到 Paperwind。这是一个为独立写作者和开发者准备的开源博客模板：没有数据库，没有复杂的后台，也不需要维护服务器。

你只需要打开一个 Markdown 文件，然后开始写作。

## 设计原则

这个模板围绕三个原则构建：

1. **内容优先。** 排版、留白和色彩都服务于阅读，而不是争夺注意力。
2. **保持轻量。** Astro 默认只发送必要的 JavaScript，文章页面接近纯 HTML。
3. **方便拥有。** 所有内容都在你的 Git 仓库里，可以随时迁移、修改和备份。

> 好的模板应该提供可靠的起点，同时允许创作者逐渐长出自己的风格。

## 从这里开始

先运行 `npm run init`，或直接编辑根目录的 `site.config.json`，替换站点名称、作者、简介、导航、社交链接和关于页文案。然后删除示例文章，在 `src/content/posts` 目录中新建 Markdown 文件。

```md
---
title: 我的第一篇文章
description: 一句话介绍这篇文章。
pubDate: 2026-07-31
tags: [随笔]
---

正文从这里开始。
```

保存文件后，开发服务器会立刻刷新页面。写完以后推送到 GitHub，新的站点就会自动构建并上线。

愿这里成为你的长期数字花园。
