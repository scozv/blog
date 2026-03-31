import { test, expect } from '@playwright/test';

test('search box should render and be functional', async ({ page }) => {
  // Navigate to the search page
  await page.goto('/search');

  // Verify that the search input renders properly
  const searchInput = page.locator('.pagefind-ui__search-input');
  await expect(searchInput).toBeVisible();

  // Test search functionality
  await searchInput.fill('astro');
  
  // Verify that search results container exists or shows something
  // Wait a bit for pagefind to process
  await page.waitForSelector('.pagefind-ui__result', { timeout: 10000 });
  
  // Verify results are visible
  const results = page.locator('.pagefind-ui__result');
  await expect(results.first()).toBeVisible();
});
