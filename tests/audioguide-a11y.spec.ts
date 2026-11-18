import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Axe Accessibility Tests', () => {
  test('page should be accessible - no violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .exclude('.shk-bar') // Exclude Shikwasa player progress bar known nesting issues
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should verify all buttons have accessible names', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .include('button')
      .analyze();

    const violations = results.violations.filter(v => v.id === 'button-name');
    expect(violations).toEqual([]);
  });

  test('should verify images have alt text', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .include('img')
      .analyze();

    const violations = results.violations.filter(v => v.id === 'image-alt');
    expect(violations).toEqual([]);
  });

  test('should verify color contrast ratios', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('should verify link names are descriptive', async ({ page }) => {
    await page.goto('/');

    const linksCount = await page.locator('a').count();
    if (linksCount > 0) {
      const results = await new AxeBuilder({ page })
        .include('a')
        .analyze();

      const violations = results.violations.filter(v => v.id === 'link-name');
      expect(violations).toEqual([]);
    }
  });

  test('should verify headings are properly structured', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withRules(['heading-order'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
