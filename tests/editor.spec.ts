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

  test('should support copy, cut, paste keyframes and simultaneous layers', async ({ page }) => {
    await page.locator('#add-keyframe').click();
    await page.locator('#copy-kf').click();
    await page.locator('#paste-kf').click();
    await expect(page.locator('.keyframe-item')).toHaveCount(2);

    await page.locator('#cut-kf').click();
    await expect(page.locator('.keyframe-item')).toHaveCount(1);

    await page.locator('#add-anno-layer').click();
    await page.locator('#add-keyframe').click();
    await expect(page.locator('#anno-layer-select option')).toHaveCount(2);
  });

  test('should add media, text, and voice synth cues to multitrack timeline and export project', async ({ page }) => {
    await page.click('.tab-btn[data-tab="media"]');
    await page.click('#add-media-3d');
    await page.click('.tab-btn[data-tab="text"]');
    await page.click('#add-text-cue');
    await page.click('.tab-btn[data-tab="audio"]');
    await page.fill('#tts-text', 'Welcome to the garden');
    await page.click('#tts-add');

    await expect(page.locator('#tl-lanes .tl-lane')).toHaveCount(6);

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#export-project').click(),
    ]);
    expect(download.suggestedFilename()).toBe('audioguide.json');
  });
});
