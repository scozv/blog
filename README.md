# Read the blog, not me :)

This is the repository for my personal blog, migrated from a 10+ year old Jekyll setup.

## Background & Customizations
The site is built on top of [Astro Paper](https://github.com/satnaing/astro-paper), with a few tailored features:
- **Bilingual Support:** Custom logic to link and toggle between English and Chinese (`-zh`) post translations, while automatically deduplicating them on the main feeds.
- **Enhanced RSS:** The RSS feed is customized to output full sanitized HTML content, including both English and Chinese posts.
- **Custom Sorting:** Sorting algorithms updated to support prioritizing by modified time (`modDatetime`), falling back to publish time (`pubDatetime`).

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
When using AI agents on this repository, please adhere to:
- **Preserve History:** Do not change my content, typos, wording, writing style, or errors in old posts. I want to keep it exactly as my 10-years-ago writing.
- **Syntax Only:** Focus exclusively on fixing rendering issues, standardizing Markdown format, and migrating legacy syntax (e.g., Jekyll highlights -> standard code blocks, ToC adjustments).

## Credits
- **LLM / AI Agents (Gemini CLI):** For immense help in resolving render regressions, migrating old Jekyll formatting logic, and writing test suites seamlessly.
- [Astro](https://astro.build/): A framework builds fast content sites, powerful web applications, dynamic server APIs, and everything in-between.
- [astro-paper](https://github.com/satnaing/astro-paper): A minimal, accessible and SEO-friendly Astro blog theme.
- [$\KaTeX$](https://katex.org/): A fast math typesetting library for the web. Integrated with this site by following [_How To Render LaTeX In Markdown With Astro.js_](https://blog.alexafazio.dev/blog/render-latex-in-astro/).