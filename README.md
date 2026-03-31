# Read the blog, not me :)

This is the repository for my personal blog, migrated from a 10+ year old Jekyll setup.

## Background & Customizations
The site is built on top of [Astro Paper](https://github.com/satnaing/astro-paper), with a few tailored features:
- **Bilingual Support:** Custom logic to link and toggle between English and Chinese (`-zh`) post translations, while automatically deduplicating them on the main feeds.
- **Enhanced RSS:** The RSS feed is customized to output full sanitized HTML content, including both English and Chinese posts.
- **Custom Sorting:** Sorting algorithms updated to support prioritizing by modified time (`modDatetime`), falling back to publish time (`pubDatetime`).
- **Minimal Homepage:** Hero section, featured posts, social sharing, and archives stripped. Posts list with inline tags only.
- **Custom 404 Page:** `404.md` using `AboutLayout.astro` — same Python code block aesthetic as the About page. Breadcrumb always shows `Home » 404` via an `override` prop added to `Breadcrumb.astro`.
- **SEO:** Custom OG image (`og.png`) derived from the favicon theme. KaTeX stylesheet moved to post pages only. `ai-content-policy` meta tag on all pages.

## How to run locally
```bash
# Install dependencies
npm install

# Run the local development server
npm run dev

# Run the test suite (Vitest + Playwright E2E)
npm run test
```

## Prompt Rules (System Prompt)
When using AI agents on this repository:
- **Preserve History:** Do not change content, typos, wording, or style in old posts. Keep 10-years-ago writing exactly as-is.
- **Syntax Only (for old posts):** Fix rendering issues, standardize Markdown format, migrate legacy syntax (Jekyll highlights → code blocks, ToC adjustments).
- **New Posts:** Follow `prompt/post-writing.md` for file naming, frontmatter, tagging, and the `[LLM-written]` transparency format.

## Credits
- **LLM / AI Agents (Gemini CLI + Antigravity):** For immense help in completing the Jekyll→Astro migration, resolving render regressions, writing tests, and — from this point on — writing new posts in the `[LLM-written]` format documented in `prompt/post-writing.md`.
- [Astro](https://astro.build/): A framework that builds fast content sites, powerful web applications, dynamic server APIs, and everything in-between.
- [astro-paper](https://github.com/satnaing/astro-paper): A minimal, accessible and SEO-friendly Astro blog theme.
- [$\KaTeX$](https://katex.org/): A fast math typesetting library for the web. Integrated by following [_How To Render LaTeX In Markdown With Astro.js_](https://blog.alexafazio.dev/blog/render-latex-in-astro/).