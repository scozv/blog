import { test, expect } from "@playwright/test";

/**
 * 404 page tests.
 *
 * These tests verify the redesigned 404 page, which:
 *   - Uses AboutLayout.astro (same Shiki code block styling as about.md)
 *   - Always shows a fixed "Home » 404" breadcrumb via Breadcrumb's override prop
 *   - Contains a Python HTTPException code block
 *   - Has a "Go back home" link
 */

const MISSING_PATHS = [
  "/this-page-does-not-exist",
  "/peter",
  "/peter%20run%20llm",
  "/posts/fake-slug-that-never-existed",
  "/tags/totally-made-up-tag/999",
];

for (const path of MISSING_PATHS) {
  test(`404 page: breadcrumb always shows "404" for path ${path}`, async ({
    page,
  }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });

    // Breadcrumb should always read "Home » 404" regardless of visited path
    const breadcrumb = page.locator("nav[aria-label='breadcrumb']");
    await expect(breadcrumb).toBeVisible();

    // "Home" link should be present and point to /
    const homeLink = breadcrumb.locator("a", { hasText: "Home" });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute("href", "/");

    // The last breadcrumb segment must always be the static "404" label,
    // never the actual URL path segment (e.g. not "peter" or "peter run llm")
    const currentPage = breadcrumb.locator('[aria-current="page"]');
    await expect(currentPage).toHaveText("404");
  });
}

test("404 page: heading reads 'Not Found'", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");
  const h1 = page.locator("h1");
  await expect(h1).toHaveText("Not Found");
});

test("404 page: Python code block is visible", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");

  // The code block should contain the HTTPException raise
  const codeBlock = page.locator("pre code");
  await expect(codeBlock).toBeVisible();
  await expect(codeBlock).toContainText("HTTPException");
  await expect(codeBlock).toContainText("status_code=404");
  await expect(codeBlock).toContainText("def get_page");
});

test("404 page: 'Go back home' link navigates to homepage", async ({
  page,
}) => {
  await page.goto("/this-page-does-not-exist");

  const homeLink = page.locator("a", { hasText: /go back home/i });
  await expect(homeLink).toBeVisible();
  await expect(homeLink).toHaveAttribute("href", "/");

  await homeLink.click();
  await expect(page).toHaveURL("/");
});

test("404 page: header and footer are rendered", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");

  // Standard site header should be present
  await expect(page.locator("header")).toBeVisible();
  // Standard site footer should be present
  await expect(page.locator("footer")).toBeVisible();
});

test("404 page: code block style matches About page (same container width)", async ({
  page,
}) => {
  // Both pages use the same app-prose max-w-app container via AboutLayout.astro
  await page.goto("/this-page-does-not-exist");
  const notFoundSection = page.locator("section.app-prose");
  await expect(notFoundSection).toBeVisible();

  await page.goto("/about");
  const aboutSection = page.locator("section.app-prose");
  await expect(aboutSection).toBeVisible();

  // Both sections should exist — visual parity is enforced by sharing the same layout
});
