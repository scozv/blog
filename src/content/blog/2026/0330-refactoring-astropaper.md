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

The blog has been running since 2013 on Jekyll. The migration to Astro started manually — the `feature/astro` branch accumulated rebases tracking AstroPaper 3.x → 4.2.0 → 5.5.1, each keeping the content moving forward but leaving accumulated debt. Starting from commit `4272eef` (the last manual rebase), a series of LLM sessions completed the open work. This post logs those sessions.

## Table of contents

## The Problem

After several rounds of manual rebasing, the blog had reached AstroPaper 5.5.1 but still carried the following debt:

- **UI noise**: stock AstroPaper ships with hero, featured posts, social sharing, and Archives — none useful for a bare engineering journal.
- **Empty card abstracts**: `description` was missing on all 39 migrated posts; the homepage showed titles only.
- **Unpublished drafts**: 6 posts sitting in `_drafts/` since 2016, never published.
- **Chinese posts**: ~20 bilingual posts not yet in the Astro collection; no bilingual toggle on post pages.
- **RSS quality**: feed outputting raw markdown — footnote definitions, `remark-toc` placeholder, reference sections.

## Stripping the Homepage

**Prompt:**
> For home pages, if you check the index.astro, it has few sections. Shall I just use posts list or even the posts.astro as the home page? For now, I don't have a plan to show any other sections. Shall I add a few tags for posts list? If remove the sections in home pages, where to put RSS icon? "Share this post on:" in post, I don't know whether I need this.

The hero, featured section, and share buttons were all upstream AstroPaper defaults. Stripping them down required changes to four files: `index.astro` lost the hero and featured sections, `config.ts` got `postPerIndex` raised to 7, `constants.ts` had `SHARE_LINKS` emptied (AstroPaper hides the share block automatically when the array is empty), and `Card.astro` gained ≤4 inline tags on the same line as the date. The RSS icon was dropped from the homepage — browser auto-discovers it via `<link>`.

**Prompt:**
> Looks good overall, thanks. But the tags seem too right-aligned. And when in the archives pages, it goes to 2 lines due to width.

`justify-between` was pushing date and tags to opposite edges. Replaced with `justify-start gap-x-4 flex-wrap` — tags sit immediately after the date and wrap gracefully on narrow viewports. Archives was disabled via `showArchives: false` in `config.ts`.

## Build Warnings and Legacy Cleanup

**Prompt:**
> Now you can run `npm run build`, and do review the log, and fix the warnings.

`astro check` returned 8 TypeScript hints: six unused social share icons in `constants.ts`, plus `IconRss` and `featuredPosts` in `index.astro`. All removed. Final build: 0 errors, 0 warnings, 0 hints.

**Prompt:**
> Now go and check the repo and you will find some folders like `_pages`, `_posts` and `.archive` are no longer needed. Let's git remove and clean up the files. For favicon, you can help me generate the SVG file based on my blog site title, name etc. Show me some options.

`git rm -r _pages _posts .archive` removed the Jekyll directories — `.archive` alone had ~100 KaTeX font files from the old build. Three SVG favicon options were proposed: monogram "S", terminal `>_`, code braces `{}`.

**Prompt (on the terminal prompt option):**
> I like this, but my prompt is `%(?.%F{blue}❯%f%F{cyan}❯%f%F{green}❯%f)`. Shall I align?

The final favicon was derived directly from the ZSH success-state prompt configuration: three `❯` chevrons in a blue → cyan → green gradient on a `#1e1e2e` dark background. Written in pure SVG, placed at `public/favicon.svg`.

**Prompt:**
> The sublines: "All the articles I've posted.", "All the tags used in posts.", "Search any article..." — we can remove right?

Dropped the `pageDesc` prop from three page files. `Main.astro` itself was not touched — keeping that upstream layout file clean for future rebases.

## Migrating the Jekyll Drafts

**Prompt:**
> Now review all the draft content in `src/content/blog/drafts/`, update the previous Jekyll format / syntax to Astro Paper or standard markdown. Make sure they render properly — code blocks, TOC, etc. For `*.cjs` scripts, you don't even need to keep them, since it's a one-time effort. Also in my posts pages, I shall try to show some abstraction in home pages — otherwise it's only the list of titles.

Six legacy drafts had been sitting in `_drafts/` since 2016. The conversion was mostly mechanical — `{% highlight %}` blocks became fenced code blocks, `{:toc}` became `## Table of contents` (required by `remark-toc`), and `<!--more-->` was removed with the preceding paragraph extracted into `description` frontmatter. A Node script then bulk-injected plain-text abstracts into all 39 existing posts, so that every card on the homepage would finally show a snippet instead of just a title.

Both `src/content/blog/drafts/` and the root `_drafts/` folder were deleted. All files moved flat into `src/content/blog/`.

**Prompt:**
> In that case, do we still need to keep the `./drafts` folder? Also, what is the warning: `[WARN] [glob-loader] Duplicate id "..." found`?

The warnings were a Vite HMR cache overlap — the dev server had both the old path (`drafts/foo.md`) and the new path (`foo.md`) indexed simultaneously mid-migration. `rm -rf .astro` cleared it on next start. No actual data conflict.

## Cleaning Up the RSS Feed

**Prompt:**
> My RSS feed is showing unparsed markdown for footnotes, TOC placeholders, and even entire reference sections. This happens because the markdown-it parser in Astro's RSS integration doesn't process these like Remark does on the main site. Can you provide a solution using regular expressions to strip these artifacts from the raw markdown body before it's passed to markdown-it for HTML conversion?

The RSS feed was being generated from raw markdown `body` via `markdown-it`, but `markdown-it` doesn't share the Remark plugin chain that powers the main site — so `remark-toc` placeholders, footnote definitions, and entire Reference sections were leaking through as literal text. Four regex passes were applied to `body` in `rss.xml.ts` before rendering, stripping all of them.

**Prompt:**
> It looks much cleaner. Thank you.

## Footer and Draft Labelling

**Prompt:**
> Let's update the footer to a simpler way: no need to add copyright YYYY — I give up all the copyright but I own the codebase. Since now LLM era, knowledge is cheap. "All rights reserved" — I don't know what that means, remove it. I want to add "Blog since YYYY with Jekyll, migrated to Astro Paper with Gemini Pro on 2026."

The footer went through several rounds. Checked `archive/jekyll-master` via git log — first commit was 2011-12-30 (repo init), but the first actual post was 2013. The wording iterated from "Blog since 2011..." through "Writing occasionally since 2013..." to the final one-liner:

```
Writing occasionally with Jekyll since 2013. Migrated to Astro with Gemini Pro.
```

The unused `currentYear` variable was also removed from `Footer.astro` — it had been left over after stripping the `© {currentYear}` span.

**Prompt:**
> For `[Draft with Jekyll, may be incomplete]` — is the wording OK? Misleading? Any better way? Keep it short.

Settled on `[Legacy Draft]` as the description prefix for the six migrated drafts. Each draft also got a TL;DR block: `This was a draft when I used Jekyll for my blog site (YYYY). It may be incomplete or contain outdated information.`

## The YAML Escape Sequence Bug

**Prompt:**
> `unknown escape sequence` at `2013-11-03-how-to-update-heap-in-dijkstra-shortest-path-zh.md:2:57`

The bulk extraction script had wrapped `description` values in double quotes. YAML double-quoted strings interpret backslash sequences, so LaTeX like `$O(n \ln m)$` caused `\l` to be read as an invalid escape by `js-yaml`. This crashed the entire content sync.

The fix was straightforward: a second pass script converted all 45 posts to single-quoted `description: '...'`. Single-quoted YAML strings treat backslashes literally. Inner single quotes were escaped as `''`.

## Bilingual Post Support

**Prompt:**
> Yes, go ahead, just one thing to note: When reading the English post: 📅 Oct 10, 2013 | Updated: Mar 21, 2024 | 🌐 [ 中文 ] — when reading the Chinese post: 📅 Oct 10, 2013 | Updated: Mar 21, 2024 | 🌐 [ English ]. For this, if not bilingual posts, "| 🌐 [ xx ]" this part should not display entirely.

`PostDetails.astro` was updated to check whether a `-zh` counterpart slug exists in the unfiltered post collection. The toggle renders only when the translation exists; absent otherwise — no empty separator, no conditional CSS hiding, just not rendered at all.

**Prompt:**
> Looks good, but now in main page, the list of the posts showing both Chinese post and English post? Shall we merge into one item? Help me design properly? And for search? How to design that? Let's align the design, give me options, and let me select, before any code changes.

This required a design decision before any code. Three areas were aligned: lists use English-first deduplication (hide `-zh` if an English counterpart exists; show if orphaned), search indexes both versions with `(中文)` appended to translated titles, and prev/next navigation applies the same dedup filter so readers flow through unique articles rather than bouncing between translations.

**Prompt:**
> If a post is English → Show it. If a post is Chinese (-zh) AND an English version exists → Hide it from the lists. If a post is Chinese (-zh) AND no English version exists → Show it. Yes, aligned. And no need adding [EN/ZH] to the title if a translation exists. For search: Option A. For Prev/Next: exact same "English-First Deduplication" filter. But do note in PostDetails.astro, we need to show bilingual toggle if there is one — meaning filtering on post list, should not apply to PostDetails.

The deduplication went into `postFilter.ts` via an optional `allPosts?` argument. The filter only deduplicates when `allPosts` is provided, so calling `postFilter(post)` with a single argument preserves draft/future-post filtering while skipping deduplication — used by RSS and by `PostDetails.astro`'s toggle check.

## The Disappearing Search Box

**Prompt:**
> Can you review the search.astro. Why there is no search box? Any breaking changes?

This one was interesting. Three attempts at fixing the `@pagefind/default-ui` dynamic import failed to restore the search box. The Vite 6 breaking change theory seemed convincing but the actual import was working fine.

**Prompt:**
> Confirmed, the search issue comes from this diff, can you review again? `git diff 4272eef f58ed52`. I switch back to `4272eef`, it's working on UI.

Diffing the commits revealed the real cause: the new `postFilter.ts` signature had made `allPosts` a positional non-optional parameter. Astro's `getCollection("blog", postFilter)` calls the filter internally with only one argument — so `allPosts` was `undefined`, `allPosts.some(...)` threw a silent `TypeError`, the build crashed before Pagefind could run, and the search UI never rendered. No error in the console, no warning in the build output. The search box just vanished.

Fix: mark `allPosts` optional with `?`. Guard with `if (isZh && allPosts)`.

**Prompt:**
> It's fixed, searching box is back now.

## RSS Full Content

**Prompt:**
> Next, for RSS, shall we allow full content? I am ok with RSS to get full content, cause I am an RSS user and I like RSS reader to read full content. Also, for both Eng and Chinese, let's put into RSS?

Two changes to `rss.xml.ts`: the collection call used `getCollection("blog", post => postFilter(post))` — the single-argument form deliberately bypasses deduplication, so both English and Chinese posts appear in the feed. Added `markdown-it` and `sanitize-html` to parse `body` into HTML for the `content` field. The regex cleanup from the RSS feed iteration was applied before parsing.

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
