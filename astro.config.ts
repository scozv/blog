import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import remarkCollapse from "remark-collapse";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    mdx(),
    sitemap(),
  ],
  markdown: {
    rehypePlugins: [rehypeKatex],
    remarkPlugins: [
      remarkToc,
      remarkMath,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
});
