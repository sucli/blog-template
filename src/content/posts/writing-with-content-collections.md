---
title: 把内容建成可校验的模型
description: 用 Content Collections 约束文章元数据，让写作流程更稳、更可迁移。
pubDate: 2026-07-10
tags: [Astro, 内容管理, 写作]
series: Astro 内容网站实践
seriesOrder: 3
---

系列的前两篇分别讨论了为什么选 Astro，以及如何一键发布。这一篇回到写作本身：怎样让“随便写一个 Markdown 文件”既保持轻量，又不至于在文章变多后失控。

## 元数据就是文章的身份证

标题、摘要、日期、标签、系列编号，这些字段看似琐碎，却决定了列表页、RSS、搜索和 SEO 能否稳定工作。Paperwind 在 `src/content.config.ts` 里用 Zod 描述它们：

```ts
const posts = defineCollection({
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),
    draft: z.boolean().default(false)
  })
});
```

少写一个字段、日期格式写错、给系列却忘了序号，构建阶段就会失败。对个人博客来说，这种“便宜的严格”比上线后再修数据省心得多。

## 草稿、定时与可迁移性

- `draft: true`：生产构建隐藏，开发环境仍可预览
- 未来日期：视为定时发布，到期前不进入生产站点
- 纯文本文件：随时可以搬到别的静态站点生成器

内容属于仓库，而不是某个托管后台。工具可以换，文章不必重写。

## 写作时只需要关心正文

配置层把导航、社交、关于页和评论都收进 `site.config.json` 之后，日常写作流程可以收束成三步：

1. 在 `src/content/posts` 新建 `.md` 或 `.mdx`
2. 填好 frontmatter，打开正文开始写
3. 推送到 `main`，由 CI 构建并发布

模板的职责是把工程噪声挡在外面，让你把注意力留给句子本身。
