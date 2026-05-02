import { test, expect } from '@playwright/test';

test.describe('Audioguide Functional Tests', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));
    await page.goto('/');
  });

  test('should display the correct metadata', async ({ page }) => {
    await expect(page.locator('#artwork-title')).toHaveText('Il Giardino Ducale');
    await expect(page.locator('#artwork-artist')).toContainText('Guido Carmignani');
  });

  test('should load the artwork image', async ({ page }) => {
    const image = page.locator('.image-container img');
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('src', 'carmignano.png');
  });

  test('should load the transcript from timing.json', async ({ page }) => {
    const firstWord = page.locator('.word').first();
    await expect(firstWord).toBeVisible();
    await expect(firstWord).toHaveText(/Ciao/);
  });

  test('clicking a word should seek the audio player', async ({ page }) => {
    await page.waitForFunction(() => (window as any).player !== undefined);

    const word = page.locator('.word').nth(1); // "questo"
    const startTimeStr = await word.getAttribute('data-start');
    const startTime = parseFloat(startTimeStr || '0');
    
    // Trigger click via evaluate to ensure internal handler is called
    await word.evaluate((el) => (el as HTMLElement).click());
    
    // Wait for the player time to be close to the start time
    await page.waitForFunction((expected) => {
      const p = (window as any).player;
      return p && Math.abs(p.currentTime - expected) < 1.0;
    }, startTime, { timeout: 10000 });

    const currentTime = await page.evaluate(() => (window as any).player.currentTime);
    expect(currentTime).toBeGreaterThan(0); // At least moved from 0
  });

  test('the word should highlight when audio plays', async ({ page }) => {
    await page.waitForFunction(() => window.player !== undefined);
    const word = page.locator('.word').first();
    
    await word.click();

    // The first word "Ciao," starts at 0.0
    await expect(word).toHaveClass(/active/, { timeout: 10000 });
  });

  test('layout should be responsive (mobile)', async ({ page, isMobile }) => {
    if (isMobile) {
      const main = page.locator('main');
      const flexDirection = await main.evaluate((el) => window.getComputedStyle(el).flexDirection);
      expect(flexDirection).toBe('column');
    }
  });

  test('should trigger annotations and zooming', async ({ page }) => {
    await page.waitForFunction(() => (window as any).player !== undefined);
    
    // Seek to 12s (where a circle annotation starts in our sample data)
    await page.evaluate(() => {
      (window as any).player.seek(12);
      (window as any).player.play();
    });

    // Wait for annotation to appear in SVG
    const circle = page.locator('#annotation-layer circle');
    await expect(circle).toBeVisible({ timeout: 10000 });
    
    // Check if zoom (transform) is applied to image
    const image = page.locator('#artwork-image');
    const transform = await image.evaluate((el) => window.getComputedStyle(el).transform);
    expect(transform).not.toBe('none');
    expect(transform).toContain('matrix'); // scale/translate results in matrix
  });
});
