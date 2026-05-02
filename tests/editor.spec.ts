import { test, expect } from '@playwright/test';

test.describe('Annotation Editor Functional Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor.html');
  });

  test('should load the artwork and player', async ({ page }) => {
    const artwork = page.locator('#artwork-image');
    await expect(artwork).toBeVisible();
    
    // Wait for Shikwasa
    await page.waitForFunction(() => (window as any).player !== undefined);
  });

  test('clicking artwork should update coordinate preview', async ({ page }) => {
    const artwork = page.locator('#artwork-image');
    const box = await artwork.boundingBox();
    if (!box) throw new Error('No bounding box');

    // Click in the middle
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    
    // The image should have a transform applied
    const transform = await artwork.evaluate((el) => window.getComputedStyle(el).transform);
    expect(transform).not.toBe('none');
  });

  test('adding a keyframe should update the list', async ({ page }) => {
    const addButton = page.locator('#add-keyframe');
    
    // Click artwork first to set a point
    const artwork = page.locator('#artwork-image');
    await artwork.click();
    
    await addButton.click();
    
    const keyframeItem = page.locator('.keyframe-item');
    await expect(keyframeItem).toHaveCount(1);
    await expect(keyframeItem).toContainText('s:');
  });

  test('exporting should trigger a download', async ({ page }) => {
    // Add a keyframe so export isn't blocked by alert
    await page.locator('#artwork-image').click();
    await page.locator('#add-keyframe').click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#export-json').click(),
    ]);

    expect(download.suggestedFilename()).toBe('annotations.json');
  });
});
