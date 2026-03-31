import { test, expect } from "@playwright/test";

/**
 * SEO meta tag tests.
 *
 * Verifies that key SEO elements are present and correct across different page types:
 *   - Homepage: title, description, OG image, canonical URL, AI policy meta
 *   - Post page: KaTeX stylesheet loaded, OG image present, structured data
 *   - robots.txt: LLM transparency comment
 */

test("homepage: <title> is set to site title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Code this\./);
});

test("homepage: meta description is not the AstroPaper placeholder", async ({
  page,
}) => {
  await page.goto("/");
  const desc = page.locator('meta[name="description"]');
  const content = await desc.getAttribute("content");
  expect(content).not.toContain("AstroPaper");
  expect(content).toBeTruthy();
  // Should describe the actual blog content
  expect(content).toMatch(/@scozv/);
});

test("homepage: OG image points to custom og.png (not AstroPaper default)", async ({
  page,
}) => {
  await page.goto("/");
  const ogImage = page.locator('meta[property="og:image"]');
  const content = await ogImage.getAttribute("content");
  expect(content).not.toContain("astropaper-og");
  expect(content).toContain("og.png");
});

test("homepage: canonical URL is set", async ({ page }) => {
  await page.goto("/");
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute("href", /blog\.scozv\.com|localhost/);
});

test("homepage: ai-content-policy meta tag is present", async ({ page }) => {
  await page.goto("/");
  const aiMeta = page.locator('meta[name="ai-content-policy"]');
  await expect(aiMeta).toHaveAttribute("content", "llm-assisted; labelled; open");
});

test("homepage: RSS link is in <head> for auto-discovery", async ({ page }) => {
  await page.goto("/");
  const rss = page.locator('link[rel="alternate"][type="application/rss+xml"]');
  await expect(rss).toHaveAttribute("href", /rss\.xml/);
});

test("homepage: sitemap link is in <head>", async ({ page }) => {
  await page.goto("/");
  const sitemap = page.locator('link[rel="sitemap"]');
  await expect(sitemap).toHaveAttribute("href", /sitemap/);
});

test("homepage: KaTeX stylesheet is NOT loaded (post-only)", async ({
  page,
}) => {
  await page.goto("/");
  // KaTeX should not load on the homepage — only on post pages
  const katex = page.locator('link[href*="katex"]');
  await expect(katex).toHaveCount(0);
});

test("post page: KaTeX stylesheet IS loaded", async ({ page }) => {
  // Navigate to the posts list and click the first post
  await page.goto("/posts/1");
  const firstPost = page.locator("article a, .card a, h2 a, h3 a").first();
  await firstPost.click();
  await page.waitForLoadState("domcontentloaded");

  const katex = page.locator('link[href*="katex"]');
  await expect(katex).toHaveCount(1);
});

test("post page: ai-content-policy meta tag is present", async ({ page }) => {
  await page.goto("/posts/1");
  const firstPost = page.locator("article a, .card a, h2 a, h3 a").first();
  await firstPost.click();
  await page.waitForLoadState("domcontentloaded");

  const aiMeta = page.locator('meta[name="ai-content-policy"]');
  await expect(aiMeta).toHaveAttribute("content", "llm-assisted; labelled; open");
});

test("post page: OG image meta tag is present", async ({ page }) => {
  await page.goto("/posts/1");
  const firstPost = page.locator("article a, .card a, h2 a, h3 a").first();
  await firstPost.click();
  await page.waitForLoadState("domcontentloaded");

  const ogImage = page.locator('meta[property="og:image"]');
  const content = await ogImage.getAttribute("content");
  expect(content).toBeTruthy();
});

test("about page: KaTeX stylesheet is NOT loaded", async ({ page }) => {
  await page.goto("/about");
  const katex = page.locator('link[href*="katex"]');
  await expect(katex).toHaveCount(0);
});

test("about page: ai-content-policy meta tag is present", async ({ page }) => {
  await page.goto("/about");
  const aiMeta = page.locator('meta[name="ai-content-policy"]');
  await expect(aiMeta).toHaveAttribute("content", "llm-assisted; labelled; open");
});

test("robots.txt: contains LLM transparency comment", async ({ page }) => {
  const response = await page.goto("/robots.txt");
  expect(response?.status()).toBe(200);
  const body = await response?.text();
  expect(body).toContain("LLM-assisted");
  expect(body).toContain("User-agent: *");
  expect(body).toContain("Allow: /");
  expect(body).toContain("sitemap");
});

test("og.png: custom OG image is served", async ({ page }) => {
  const response = await page.goto("/og.png");
  expect(response?.status()).toBe(200);
  expect(response?.headers()["content-type"]).toContain("image/png");
});
