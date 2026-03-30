---
title: "Completing a Jekyll-to-Astro Migration with LLM Assistance"
slug: "refactoring-astropaper-ui-simplification"
pubDatetime: 2026-03-30T15:00:00Z
description: '[LLM] A 10-year-old Jekyll blog, manually rebased through AstroPaper 3→4→5, then finished with LLM sessions: UI cleanup, bilingual Chinese post migration, legacy draft publishing, RSS full content, and a custom ZSH-derived favicon.'
draft: false
tags:
  - astro
  - typescript
  - zsh
  - gemini
  - claude-sonnet
  - llm-assisted
  - jekyll
---

> [LLM-written] The post structure and prose were written by an LLM based on user prompts. User prompts are quoted verbatim (spelling corrected only) — the human directed, the LLM wrote.

The blog has been running since 2013 on Jekyll. The migration to Astro started manually — the `feature/astro` branch accumulated rebases tracking AstroPaper 3.x → 4.2.0 → 5.5.1, leaving accumulated content debt. Starting from commit `4272eef` (the last manual rebase), LLM sessions completed the open work. This post logs those sessions.

## Table of contents

## The Problem

- **UI noise**: stock AstroPaper ships with hero, featured posts, social sharing, and Archives — none useful for a bare engineering journal.
- **Empty card abstracts**: `description` was missing on all 39 migrated posts; the homepage showed titles only.
- **Unpublished drafts**: 6 posts sitting in `_drafts/` since 2016, never published.
- **Chinese posts**: ~20 bilingual posts not yet in the Astro collection; no bilingual toggle on post pages.
- **RSS quality**: feed outputting raw markdown — footnote definitions, `remark-toc` placeholder, reference sections.

## Iteration 1: Homepage and Card Design

**Prompt:**
> For home pages, if you check the index.astro, it has few sections. Shall I just use posts list or even the posts.astro as the home page? For now, I don't have a plan to show any other sections. Shall I add a few tags for posts list? If remove the sections in home pages, where to put RSS icon? "Share this post on:" in post, I don't know whether I need this.

Stripped the hero and featured sections from `index.astro`, raised `postPerIndex` to 7, emptied `SHARE_LINKS` (AstroPaper hides the share block automatically when the array is empty), added ≤4 inline tags to `Card.astro` on the same line as the date, and dropped the RSS icon from the homepage (browser auto-discovers it via `<link>`).

## Iteration 2: Tag Alignment Fix

**Prompt:**
> Looks good overall, thanks. But the tags seem too right-aligned. And when in the archives pages, it goes to 2 lines due to width.

`justify-between` was the culprit. Replaced with `justify-start gap-x-4 flex-wrap` — tags sit immediately after the date and wrap gracefully on narrow viewports.

**Prompt:**
> Shall I keep archives page? It's duplicated.

Disabled via `showArchives: false` in `config.ts`. AstroPaper removes the navigation link automatically.

## Iteration 3: Build Warning Cleanup

**Prompt:**
> Now you can run `npm run build`, and do review the log, and fix the warnings.

8 TypeScript hints: six unused social share icons in `constants.ts`, plus `IconRss` and `featuredPosts` in `index.astro`. All removed. Final build: 0 errors, 0 warnings, 0 hints.

## Iteration 4: Legacy Folder Removal and Favicon

**Prompt:**
> Now go and check the repo and you will find some folders like `_pages`, `_posts` and `.archive` are no longer needed. Let's git remove and clean up the files. For favicon, you can help me generate the SVG file based on my blog site title, name etc. Show me some options.

`git rm -r _pages _posts .archive` removed the Jekyll directories (`.archive` alone had ~100 KaTeX font files from the old Jekyll build). Three SVG favicon options were proposed: monogram "S", terminal `>_`, code braces `{}`.

**Prompt (on the terminal prompt option):**
> I like this, but my prompt is `%(?.%F{blue}❯%f%F{cyan}❯%f%F{green}❯%f)`. Shall I align?

Final favicon: three `❯` chevrons in a blue → cyan → green gradient on a `#1e1e2e` dark background, derived directly from the ZSH success-state prompt configuration. Written in pure SVG, placed at `public/favicon.svg`.

## Iteration 5: Boilerplate Text Removal

**Prompt:**
> The sublines: "All the articles I've posted.", "All the tags used in posts.", "Search any article..." — we can remove right?

Dropped the `pageDesc` prop from `posts/[...page].astro`, `tags/index.astro`, and `search.astro`. `Main.astro` not touched — keeping that upstream file clean for future rebases.

## Iteration 6: Jekyll Draft Migration

**Prompt:**
> Now review all the draft content in `src/content/blog/drafts/`, update the previous Jekyll format / syntax to Astro Paper or standard markdown. Make sure they render properly — code blocks, TOC, etc. For `*.cjs` scripts, you don't even need to keep them, since it's a one-time effort. Also in my posts pages, I shall try to show some abstraction in home pages — otherwise it's only the list of titles.

Six legacy drafts converted: `{% highlight %}` → fenced code blocks, `{:toc}` → `## Table of contents`, `<!--more-->` removed with the preceding text extracted into `description`. A Node script then bulk-injected plain-text abstracts into all 39 existing posts. Both `src/content/blog/drafts/` and `_drafts/` deleted.

**Prompt:**
> In that case, do we still need to keep the `./drafts` folder? Also, what is the warning: `[WARN] [glob-loader] Duplicate id "..." found`?

Vite HMR cache overlap from the path change mid-migration. `rm -rf .astro` cleared it on next start.

## Iteration 7: RSS Feed Markdown Cleanup

**Prompt:**
> My RSS feed is showing unparsed markdown for footnotes, TOC placeholders, and even entire reference sections. This happens because the markdown-it parser in Astro's RSS integration doesn't process these like Remark does on the main site. Can you provide a solution using regular expressions to strip these artifacts from the raw markdown body before it's passed to markdown-it for HTML conversion?

Applied four regex passes to `body` in `rss.xml.ts` before `markdown-it`: strips the `remark-toc` placeholder, reference sections and everything after them, footnote definitions, and inline footnote markers.

**Prompt:**
> It looks much cleaner. Thank you.

## Iteration 8: Footer Simplification

**Prompt:**
> Let's update the footer to a simpler way: no need to add copyright YYYY — I give up all the copyright but I own the codebase. Since now LLM era, knowledge is cheap. "All rights reserved" — I don't know what that means, remove it. I want to add "Blog since YYYY with Jekyll, migrated to Astro Paper with Gemini Pro on 2026."

The footer went through several rounds:

| Round | Text |
|---|---|
| 1 | Blog since 2011 with Jekyll, migrated to Astro Paper with Gemini Pro on 2026 |
| 2 | Writing occasionally since 2013. / Migrated from Jekyll to Astro Paper with Gemini Pro in 2026. |
| 3 | Writing occasionally with Jekyll since 2013. Migrated to Astro with Gemini Pro. |

Final one-liner (year omitted — "anyone can check git"). The unused `currentYear` variable was also removed from `Footer.astro`.

**Prompt:**
> For `[Draft with Jekyll, may be incomplete]` — is the wording OK? Misleading? Any better way? Keep it short.

Settled on `[Legacy Draft]`. TL;DR block in each post: `This was a draft when I used Jekyll for my blog site (YYYY). It may be incomplete or contain outdated information.`

## Iteration 9: YAML Parse Error

**Prompt:**
> `unknown escape sequence` at `2013-11-03-how-to-update-heap-in-dijkstra-shortest-path-zh.md:2:57`

The bulk extraction script had wrapped `description` values in double quotes. LaTeX like `$O(n \ln m)$` caused `\l` to be read as an invalid YAML escape by `js-yaml`. A second pass converted all 45 posts to single-quoted `description: '...'`, which treats backslashes literally.

## Iteration 10: Bilingual Post Support

**Prompt:**
> Yes, go ahead, just one thing to note: When reading the English post: 📅 Oct 10, 2013 | Updated: Mar 21, 2024 | 🌐 [ 中文 ] — when reading the Chinese post: 📅 Oct 10, 2013 | Updated: Mar 21, 2024 | 🌐 [ English ]. For this, if not bilingual posts, "| 🌐 [ xx ]" this part should not display entirely.

`PostDetails.astro` checks for a `-zh` counterpart in the unfiltered collection. Toggle renders only when the translation exists; absent otherwise.

**Prompt:**
> Looks good, but now in main page, the list of the posts showing both Chinese post and English post? Shall we merge into one item? Help me design properly? And for search? How to design that? Let's align the design, give me options, and let me select, before any code changes.

Design aligned before any code: lists use English-first deduplication (hide `-zh` if English exists, show if orphaned); search indexes both versions with `(中文)` appended to translated titles; prev/next applies the same dedup filter.

**Prompt:**
> If a post is English → Show it. If a post is Chinese (-zh) AND an English version exists → Hide it from the lists. If a post is Chinese (-zh) AND no English version exists → Show it. Yes, aligned. And no need adding [EN/ZH] to the title if a translation exists. For search: Option A. For Prev/Next: exact same "English-First Deduplication" filter. But do note in PostDetails.astro, we need to show bilingual toggle if there is one — meaning filtering on post list, should not apply to PostDetails.

`postFilter.ts` received an optional `allPosts?` argument — deduplication only runs when provided, so calling `postFilter(post)` with one argument skips it. Applied across `postFilter.ts`, `archives/index.astro`, and `PostDetails.astro`.

## Iteration 11: Search Box Disappearance

**Prompt:**
> Can you review the search.astro. Why there is no search box? Any breaking changes?

Three attempted `@pagefind/default-ui` import fixes failed to restore it. Identified via `git diff 4272eef f58ed52`.

**Prompt:**
> Confirmed, the search issue comes from this diff, can you review again? `git diff 4272eef f58ed52`. I switch back to `4272eef`, it's working on UI.

Root cause: `postFilter.ts`'s new signature made `allPosts` a positional non-optional argument. Astro's `getCollection("blog", postFilter)` calls the filter with only one arg — `allPosts` becomes `undefined`, `allPosts.some(...)` throws a silent `TypeError`, Pagefind never runs, search UI never renders. Fix: mark `allPosts` optional; guard with `if (isZh && allPosts)`.

**Prompt:**
> It's fixed, searching box is back now.

## Iteration 12: RSS Full Content

**Prompt:**
> Next, for RSS, shall we allow full content? I am ok with RSS to get full content, cause I am an RSS user and I like RSS reader to read full content. Also, for both Eng and Chinese, let's put into RSS?

`getCollection("blog", post => postFilter(post))` — single-arg call bypasses deduplication, so both EN and ZH appear in the feed. Added `markdown-it` + `sanitize-html`; the regex cleanup from Iteration 7 applied to `body` before parsing.

## Result

| Item | Before | After |
|---|---|---|
| Homepage | Hero + featured + heading + 4 posts | Direct post list, 7 entries, no heading |
| Post cards | Date only | Date + ≤4 inline tags, flex-wrapped |
| Social sharing | 6 platform buttons | Removed |
| Archives | Enabled | `showArchives: false` |
| Build warnings | 8 TS hints | 0 errors, 0 warnings, 0 hints |
| Repo root | `_pages/`, `_posts/`, `.archive/`, `_drafts/` | Removed |
| Favicon | Default AstroPaper paper icon | Custom ZSH `❯❯❯` gradient SVG |
| Legacy drafts | 6 unpublished files in `_drafts/` | Migrated and published in `src/content/blog/` |
| Post descriptions | Empty or missing on 39 posts | Plain-text abstracts extracted and injected |
| Footer | `Copyright © YYYY \| All rights reserved.` | `Writing occasionally with Jekyll since 2013. Migrated to Astro with Gemini Pro.` |
| RSS Feed | Description only, English only | Full content, both EN + ZH; markdown artifacts stripped |
| YAML safety | Double-quoted descriptions (breaks on LaTeX) | Single-quoted throughout |
| Bilingual toggle | None | `🌐 [ 中文 ]` / `🌐 [ English ]` shown only when translation exists |
| Post lists | EN + ZH shown as separate items | English-first deduplication; `-zh` hidden if EN exists |
| Search | Both versions indexed, indistinguishable | Both indexed; `(中文)` appended to translated post titles |
| Core layout files modified | — | 0 (all changes in config or isolated components) |
