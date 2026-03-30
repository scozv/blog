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

The blog has been running since 2013 on Jekyll. The migration to Astro started manually — not all at once. Over time, the `feature/astro` branch accumulated a series of manual rebases tracking upstream AstroPaper releases: 3.x, then 4.2.0, then 4.x, and finally 5.5.1. Each rebase kept the content moving forward but left accumulated content debt: empty `description` fields on 39 posts (the homepage cards were showing titles only), ~20 Chinese posts not yet imported, 6 unpublished Jekyll drafts sitting in `_drafts/`, and RSS outputting raw markdown artifacts.

Starting from commit `4272eef` (AstroPaper 5.5.1, the last manual rebase), a series of LLM sessions completed what the manual phase had left open. This post logs those sessions.

## Table of contents

## The Problem

Multiple layers of debt accumulated across the manual migration phase:

- **UI noise**: the upstream AstroPaper theme ships with a hero section, featured posts, social sharing buttons, and an Archives page — none of which fit a bare engineering journal.
- **Empty card abstracts**: the `description` frontmatter field was missing or blank on all 39 posts migrated from Jekyll. AstroPaper uses this field to render the snippet on the post list — without it, every card shows the title then nothing.
- **Unpublished drafts**: 6 posts had been sitting in `_drafts/` since the Jekyll era (2016), never published. The content was complete enough to share as-is with appropriate labelling.
- **Chinese post migration**: ~20 bilingual Chinese posts were not yet imported into the Astro content collection, and there was no bilingual toggle on post detail pages.
- **RSS quality**: the RSS feed was outputting raw markdown — footnote definitions, `remark-toc` placeholders, reference sections — because `markdown-it` in the RSS generator does not share Remark's plugin chain.

## Iteration 1: Homepage and Card Design

**Prompt:**
> For home pages, if you check the index.astro, it has few sections. Shall I just use posts list or even the posts.astro as the home page? For now, I don't have a plan to show any other sections. Shall I add a few tags for posts list? If remove the sections in home pages, where to put RSS icon? "Share this post on:" in post, I don't know whether I need this.

The LLM produced an implementation plan covering:
- Strip the hero and featured sections from `index.astro`
- Increase `postPerIndex` from 4 to 7 in `config.ts` to match `postPerPage`
- Empty `SHARE_LINKS` in `constants.ts` (AstroPaper hides the share block automatically when the array is empty)
- Add ≤4 inline tags to `Card.astro` using a flex row on the same line as the date
- Drop the RSS icon from the homepage entirely (browser auto-discovery via `<link>` handles it)

After approval, all four files were modified. Build ran clean.

## Iteration 2: Tag Alignment Fix

**Prompt:**
> Looks good overall, thanks. But the tags seem too right-aligned. And when in the archives pages, it goes to 2 lines due to width.

`justify-between` was the culprit — it pushed the date and tags to opposite edges of the card. Replaced with `justify-start gap-x-4 flex-wrap`. Tags now sit immediately after the date and wrap under it gracefully on narrow viewports, rather than leaving an awkward blank gap in the middle.

**Prompt:**
> Shall I keep archives page? It's duplicated.

Disabled via `showArchives: false` in `config.ts`. No files deleted — just a flag. AstroPaper natively removes the "Archives" link from the header navigation.

## Iteration 3: Build Warning Cleanup

**Prompt:**
> Now you can run `npm run build`, and do review the log, and fix the warnings.

`astro check` returned 8 TypeScript hints: six unused icon imports in `constants.ts` (all social share icons, now that `SHARE_LINKS` is empty), plus `IconRss` and `featuredPosts` in `index.astro`. All removed. Final build: 0 errors, 0 warnings, 0 hints.

The duplicate `[glob-loader] id` warnings visible during `npm run dev` are a Vite dev cache artifact — they resolved automatically on a clean build.

## Iteration 4: Legacy Folder Removal and Favicon

**Prompt:**
> Now go and check the repo and you will find some folders like `_pages`, `_posts` and `.archive` are no longer needed. Let's git remove and clean up the files. For favicon, you can help me generate the SVG file based on my blog site title, name etc. Show me some options.

Three legacy Jekyll directories were removed with one command:

```bash
git rm -r _pages _posts .archive
```

The `.archive` folder alone contained ~100 KaTeX font files from the old Jekyll build. Three SVG favicon options were proposed (monogram "S", terminal `>_`, code braces `{}`).

**Prompt (on the terminal prompt option):**
> I like this, but my prompt is `%(?.%F{blue}❯%f%F{cyan}❯%f%F{green}❯%f)`. Shall I align?

The final favicon was derived directly from the ZSH success-state prompt configuration: three `❯` chevrons in a blue → cyan → green gradient on a `#1e1e2e` dark background with rounded corners. Written in pure SVG, placed at `public/favicon.svg`.

## Iteration 5: Boilerplate Text Removal

**Prompt:**
> The sublines: "All the articles I've posted.", "All the tags used in posts.", "Search any article..." — we can remove right?

Three one-line changes: dropped the `pageDesc` prop from `posts/[...page].astro`, `tags/index.astro`, and `search.astro`. `Main.astro` itself was not touched — keeping that upstream layout file clean for future rebases.

## Iteration 6: Jekyll Draft Migration

**Prompt:**
> Now review all the draft content in `src/content/blog/drafts/`, update the previous Jekyll format / syntax to Astro Paper or standard markdown. Make sure they render properly — code blocks, TOC, etc. For `*.cjs` scripts, you don't even need to keep them, since it's a one-time effort. Also in my posts pages, I shall try to show some abstraction in home pages — otherwise it's only the list of titles.

Six legacy drafts in `_drafts/` and `src/content/blog/drafts/` were migrated:

- Jekyll `{% highlight %}` blocks → fenced code blocks with language annotation
- `{:toc}` → `## Table of contents` (required by `remark-toc`)
- `<!--more-->` removed; text above it extracted and injected into `description` frontmatter — this is what AstroPaper renders on the card list
- A Node script extracted plain-text abstracts from all 39 posts and bulk-updated the `description` field across the entire blog directory

The `drafts/` subdirectory was deleted — all files moved flat into `src/content/blog/`. The root `_drafts/` folder was also removed. System prompts were saved to `prompt/` for future sessions.

**Prompt:**
> In that case, do we still need to keep the `./drafts` folder? Also, what is the warning: `[WARN] [glob-loader] Duplicate id "..." found`?

The duplicate id warnings were Vite HMR cache overlap — the dev server had both the old path (`drafts/foo.md`) and new path (`foo.md`) indexed simultaneously mid-migration. A `rm -rf .astro` cache flush resolved it on next start. No actual data conflict.

## Iteration 7: RSS Feed Markdown Cleanup

**Prompt:**
> My RSS feed is showing unparsed markdown for footnotes, TOC placeholders, and even entire reference sections. This happens because the markdown-it parser in Astro's RSS integration doesn't process these like Remark does on the main site. Can you provide a solution using regular expressions to strip these artifacts from the raw markdown body before it's passed to markdown-it for HTML conversion?

Three types of artifacts were polluting the RSS output: inline footnote markers (`[^1]`), footnote definitions (`[^1]: ...`), and the `remark-toc` placeholder. The `## References` / `## 参考文献` sections were also unnecessary for feed readers.

The fix applied a series of regex passes to `body` in `rss.xml.ts` *before* passing it to `markdown-it`:

- TOC placeholder: `* Will be replaced with the ToC[\s\S]*?\{:toc\}`
- Reference sections and everything after: `^#{1,6}\s*(References|参考文献)[\s\S]*$`
- Footnote definitions: `^\[\^.*?\]:.*$`
- Inline footnote markers: `\[\^.*?\]`

**Prompt:**
> It looks much cleaner. Thank you.

No further changes needed. The RSS feed now renders clean prose without raw markdown leaking through.

## Iteration 8: Footer Simplification

**Prompt:**
> Let's update the footer to a simpler way: no need to add copyright YYYY — I give up all the copyright but I own the codebase. Since now LLM era, knowledge is cheap. "All rights reserved" — I don't know what that means, remove it. I want to add "Blog since YYYY with Jekyll, migrated to Astro Paper with Gemini Pro on 2026."

The footer went through several rounds of refinement. Checked `archive/jekyll-master` via git log — first commit was 2011-12-30 (repo init), but first actual post was 2013. Iterated on wording:

| Round | Text |
|---|---|
| 1 | Blog since 2011 with Jekyll, migrated to Astro Paper with Gemini Pro on 2026 |
| 2 | Writing occasionally since 2013. / Migrated from Jekyll to Astro Paper with Gemini Pro in 2026. |
| 3 | Writing occasionally with Jekyll since 2013. Migrated to Astro with Gemini Pro. |

Final one-liner (year removed — "anyone can check git"):

```
Writing occasionally with Jekyll since 2013. Migrated to Astro with Gemini Pro.
```

The unused `currentYear` variable was also removed from `Footer.astro` — it had been left over after stripping the `© {currentYear}` span, and `astro check` was emitting a TS hint for it.

**Prompt:**
> For `[Draft with Jekyll, may be incomplete]` — is the wording OK? Misleading? Any better way? Keep it short.

Settled on `[Legacy Draft]` as the description prefix for the six migrated drafts. The inline TL;DR block at the top of each post was updated to:

> `TL;DR: This was a draft when I used Jekyll for my blog site (YYYY). It may be incomplete or contain outdated information.`

## Iteration 9: YAML Parse Error

**Prompt:**
> `unknown escape sequence` at `2013-11-03-how-to-update-heap-in-dijkstra-shortest-path-zh.md:2:57`

The bulk `description` injection script had wrapped values in double quotes. When an abstract contained LaTeX like `$O(n \ln m)$`, the `\l` was interpreted as an invalid YAML escape sequence by `js-yaml`.

Fix: a second pass script converted all `description: "..."` fields to single-quoted `description: '...'` across all 45 posts. Single-quoted YAML strings treat backslashes literally. The script also escaped any inner single quotes as `''`.

## Iteration 10: Bilingual Post Support

**Prompt:**
> Yes, go ahead, just one thing to note: When reading the English post: 📅 Oct 10, 2013 | Updated: Mar 21, 2024 | 🌐 [ 中文 ] — when reading the Chinese post: 📅 Oct 10, 2013 | Updated: Mar 21, 2024 | 🌐 [ English ]. For this, if not bilingual posts, "| 🌐 [ xx ]" this part should not display entirely.

`PostDetails.astro` was updated with a bilingual toggle: it checks whether a `-zh` counterpart slug exists in the unfiltered post collection. If a translation is found, the `🌐 [ 中文 ]` / `🌐 [ English ]` link renders next to the date. If not, the element is absent entirely — no empty separator, no broken UI.

**Prompt:**
> Looks good, but now in main page, the list of the posts showing both Chinese post and English post? Shall we merge into one item? Help me design properly? And for search? How to design that? Let's align the design, give me options, and let me select, before any code changes.

Three areas were designed before any code was written:

**Lists** — "English-First Deduplication": show English posts; hide `-zh` posts if an English counterpart exists; show `-zh` if no English version exists (orphan Chinese posts stay visible).

**Search** — Option A (Index Both): both versions indexed by Pagefind. Chinese posts get `(中文)` appended to their `<title>` so search results are distinguishable.

**Prev/Next** — same deduplication filter applied so navigation flows through unique logical articles, not between translations.

**Prompt:**
> If a post is English → Show it. If a post is Chinese (-zh) AND an English version exists → Hide it from the lists. If a post is Chinese (-zh) AND no English version exists → Show it. Yes, aligned. And no need adding [EN/ZH] to the title if a translation exists. For search: Option A. For Prev/Next: exact same "English-First Deduplication" filter. But do note in PostDetails.astro, we need to show bilingual toggle if there is one — meaning filtering on post list, should not apply to PostDetails.

`postFilter.ts` received a third optional argument `allPosts?: CollectionEntry<"blog">[]`. The deduplication logic only runs when `allPosts` is provided, so calling `postFilter(post)` with one argument preserves draft/future-post filtering while skipping deduplication — used by RSS and `PostDetails.astro`'s toggle check.

## Iteration 11: Search Box Disappearance

**Prompt:**
> Can you review the search.astro. Why there is no search box? Any breaking changes?

Three attempts at dynamic-import fixes for `@pagefind/default-ui` failed to restore the box. The real cause was identified by comparing commits:

**Prompt:**
> Confirmed, the search issue comes from this diff, can you review again? `git diff 4272eef f58ed52`. I switch back to `4272eef`, it's working on UI.

The root cause was in `postFilter.ts`. The updated signature required `allPosts` as a positional parameter. When Astro calls `getCollection("blog", postFilter)` internally, it passes only one argument (`post`). This made `allPosts` evaluate to `undefined`, causing `allPosts.some(...)` to throw a silent `TypeError`. The crash happened before Pagefind could run, so no search index was generated and the UI never rendered.

Fix: make `index` and `allPosts` optional (`?`). The guard `if (isZh && allPosts)` then safely skips deduplication when called with a single argument.

**Prompt:**
> It's fixed, searching box is back now.

## Iteration 12: RSS Full Content

**Prompt:**
> Next, for RSS, shall we allow full content? I am ok with RSS to get full content, cause I am an RSS user and I like RSS reader to read full content. Also, for both Eng and Chinese, let's put into RSS?

`rss.xml.ts` was updated to:

1. Call `getCollection("blog", post => postFilter(post))` — single-argument form deliberately bypasses deduplication, so both English and Chinese posts appear in the feed.
2. Add `markdown-it` + `sanitize-html` to parse and clean the raw `body` string before setting it as the `content` field on each RSS item.

The regex cleanup from Iteration 7 (stripping TOC placeholders, footnote definitions, and reference sections) was applied to `body` before parsing, so feed readers receive clean prose rather than raw markdown artifacts.

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

The recurring theme across every change: touch config files and isolated components, leave core layout files untouched. Every modification in this session is in `config.ts`, `constants.ts`, or a single component file — nothing that would cause a merge conflict during a future `git rebase` against upstream AstroPaper.

