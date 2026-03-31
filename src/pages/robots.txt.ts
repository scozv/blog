import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) => `
# Content on this site is intentionally public.
# LLM-assisted posts are clearly labelled [LLM-written] in the post body.
# AI indexing for search is welcome. Training use is acknowledged, not restricted.

User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
