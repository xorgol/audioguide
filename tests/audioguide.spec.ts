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
    const image = page.locator('#artwork-image-bg');
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('src', 'carmignano.png');
  });

  test('clicking a word should seek the audio player', async ({ page }) => {
    // Wait for player to be ready
    await page.waitForFunction(() => (window as any).player !== undefined);
    
    // Switch to Transcript mode
    await page.click('#toggle-display');
    
    // Select a word further in the text (e.g. index 10) to make the jump obvious
    const word = page.locator('.word').nth(10);
    await expect(word).toBeVisible();
    
    const startTime = await word.evaluate((el) => parseFloat(el.getAttribute('data-start') || '0'));
    expect(startTime).toBeGreaterThan(1); // Ensure we are not at the very beginning
    
    // Trigger click via evaluate to be sure it hits the DOM element directly
    await word.evaluate((el) => (el as HTMLElement).click());
    
    // Wait for the player time to update to near the start time
    await page.waitForFunction((expected) => {
      const p = (window as any).player;
      return p && Math.abs(p.currentTime - expected) < 0.5;
    }, startTime, { timeout: 15000 });

    const currentTime = await page.evaluate(() => (window as any).player.currentTime);
    expect(currentTime).toBeCloseTo(startTime, 0);
  });

  test('should trigger annotations and zooming', async ({ page }) => {
    await page.waitForFunction(() => (window as any).player !== undefined);
    await page.waitForFunction(() => (window as any).annotations && (window as any).annotations.length > 0);

    await page.evaluate(() => {
      (window as any).player.seek(7);
      (window as any).player.play();
    });

    // Check SVG layer content - at 7s there should be a circle or pointer based on annotations.json
    await page.waitForFunction(() => document.getElementById('annotation-layer').innerHTML !== '', { timeout: 15000 });
    
    const annotation = page.locator('#annotation-layer > *').first();
    await expect(annotation).toBeVisible({ timeout: 15000 });

    const transform = await page.locator('#artwork-image-bg').evaluate((el) => window.getComputedStyle(el).transform);
    expect(transform).not.toBe('none');
  });
});
