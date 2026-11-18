import { test, expect } from '@playwright/test';

test.describe('Annotation Editor Functional Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor.html');
  });

  test('should load the artwork and player', async ({ page }) => {
    const artwork = page.locator('#artwork-image-bg');
    await expect(artwork).toBeVisible();
    await page.waitForFunction(() => (window as any).player !== undefined);
  });

  test('adding a keyframe should update the list', async ({ page }) => {
    const addButton = page.locator('#add-keyframe');
    await addButton.click();
    
    const keyframeItem = page.locator('.keyframe-item');
    await expect(keyframeItem).toHaveCount(1);
  });

  test('exporting should trigger a download', async ({ page }) => {
    await page.locator('#add-keyframe').click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#export-json').click(),
    ]);

    expect(download.suggestedFilename()).toBe('annotations.json');
  });
});
