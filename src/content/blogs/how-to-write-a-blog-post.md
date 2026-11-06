---
title: How to Write a Blog Post for BTU Tech Hub
date: 2026-11-06
author: BTU Tech Hub
excerpt: Anyone in the community can publish a blog post. Write it in markdown, open a pull request, and it goes live on the Blogs page once merged.
tags: Guide, Open Source, Contributing
---

## Why Write for the Blog?

Every post on the Blogs page is an open-source contribution. You share what you learned, the community reads it, and the next student who hits the same problem finds your answer. You do not need to be an expert. If you learned something this week, someone else is still learning it.

## What You Can Write

- **Meetup recaps:** What happened at a session, and what you took away from it.
- **Tutorials:** A small build you finished, step by step.
- **Explainers:** A concept you find hard to explain, broken down simply.
- **Project stories:** What you built, what broke, and what you would change.
- **Tool reviews:** A library, model, or service you tried, with honest notes.

## The Five Steps

1. **Fork the repository** on GitHub and clone your fork.
2. **Create a markdown file** in `src/content/blogs/`. Use lowercase kebab-case for the name, for example `my-first-rag-app.md`. The filename becomes the page address, so `my-first-rag-app.md` opens at `/blogs/my-first-rag-app`.
3. **Add the frontmatter** at the top of the file (see below), then write your post below it.
4. **Preview locally** with `npm install` and `npm run dev`, then open `http://localhost:8080/blogs`.
5. **Open a pull request.** Use the template, describe your post in one line, and link any related issue.

## Frontmatter

Every post starts with a block between two lines of three dashes. The block holds these fields, one per line:

- `title`: **required**. Shown as the page heading. A colon is fine.
- `date`: **required**. Format `YYYY-MM-DD`. Posts are sorted newest first.
- `author`: **required**. Your name or GitHub handle.
- `excerpt`: **required**. One short paragraph for the listing card.
- `tags`: optional. Comma-separated, for example `Tutorial, AI`.

For example, the block for a post titled "My First RAG App" looks like this: a line of three dashes, then `title: My First RAG App`, `date: 2026-11-20`, `author: Your Name`, `excerpt: ...`, `tags: Tutorial, AI`, then a closing line of three dashes.

## Writing the Body

The body supports the markdown we already use in meetup recaps:

- `## Heading` for sections, and `### Subheading` for smaller parts
- `**bold**` for emphasis and `[link text](https://example.com)` for links
- `- item` for bullet lists
- `---` on its own line for a divider
- Photos: put them in `src/content/images-meetup/`, then add the image on its own line using markdown image syntax, with the path to the file in that folder

Keep it clear and kind. Write for a beginner who is one step behind you, and say what you tried, including what failed.

## Review Checklist

Before you open the PR, check that:

- [ ] The filename is lowercase kebab-case and ends in `.md`
- [ ] All four required frontmatter fields are filled in
- [ ] `npm run build` runs without errors
- [ ] You shared only content you are allowed to share, and any photos show people who agreed to be photographed

## Questions?

Ask in the [Discord community](https://discord.gg/jWHT3fPuHj), or open an issue using the **Feature Request** template. First-time contributors are welcome, and reviewers will help you get the post merged.
