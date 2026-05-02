# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: audioguide.spec.ts >> Audioguide Functional Tests >> clicking a word should seek the audio player
- Location: tests/audioguide.spec.ts:27:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - heading "Il Giardino Ducale" [level=2] [ref=e4]
      - paragraph [ref=e5]: Guido Carmignani (1878/1880)
    - generic [ref=e7]:
      - img "Il Giardino Ducale alla metà del secolo XVIII" [ref=e8]
      - img
    - generic [ref=e9]:
      - paragraph [ref=e10]: Tocca una parola per saltare a quel punto dell'audio.
      - paragraph [ref=e12]: Ciao, questo è un prototipo di audioguida. Inquadrando il codice QR al di sotto del quadro, senza bisogno di alcuna installazione, si aprirà automaticamente questa guida. Nella parte superiore dello schermo comparirà una piccola riproduzione del quadro in considerazione, in questo caso il Giardino Ducale alla metà del secolo XVIII di Guido Carmignani, come indicato anche su schermo. L'immagine è piccola e discreta per non distogliere l'attenzione dello spettatore dal quadro reale. Il suo scopo è principalmente quello di confermare che sì, è effettivamente quello il quadro di cui stiamo parlando, ed evidenziare alcuni degli specifici dettagli su cui la guida richiama l'attenzione. Il pulsante alla destra dello schermo attiva e disattiva i sottotitoli. Le frecce al lato del tasto play permettono di mandare il playback avanti o indietro di 15 secondi. L'audioguida può anche essere divisa in capitoli che possono essere selezionati tramite questa interfaccia. La suddivisione in capitoli permette di organizzare il contenuto tematicamente, approfondendo il periodo storico, la corrente artistica di riferimento o la vita dell'autore, oltre a tutti gli altri. La scena di un'audioguida è la descrizione dell'opera. Questa può essere accompagnata da una sonorizzazione aumentando notevolmente l'immersività nell'esperienza. Una scena di genere ambientata in un parco cittadino, per esempio, si può arricchiare con lo stormire della vegetazione e i cinghietti di uccelli. Le figure maschili e femminili in abiti settecenteschi che passeggiano, conversano o si riposano all'ombra degli alberi prendono vita grazie al chiacchiericcio e al fruscio delle stoffe. L'utilizzo di un'audioguida digitale di questo tipo permette lo sviluppo di molte funzionalità aggiuntive. Si può, per esempio, prevedere la funzione multilingua o pianificare diversi livelli di esperienza adattando il modo in cui viene trasmesso il contenuto a livello di conoscenza del singolo utente. Questo consentirebbe l'aggiunta di contenuti specifici per un determinato tipo di pubblico. Per un pubblico infantile, per esempio, oltre a prevedere una spiegazione adatta all'età, permetterebbe l'inserimento di attività specifiche e piccoli giochi per mantenere alta l'attenzione della fascia di pubblico più facilmente distraibile. Per passare al prossimo quadro è sufficiente scansionare il codice QR seguente. Grazie.
  - generic [ref=e16]:
    - generic "progress bar" [ref=e18] [cursor=pointer]:
      - progressbar "loaded progress"
      - progressbar "played progress":
        - slider "seek progress" [ref=e19]
    - generic [ref=e21]:
      - generic [ref=e22]:
        - generic [ref=e23]: Carmignani Guido - 1878/1880
        - generic [ref=e26]: Il Giardino Ducale nel Secolo XVIII
      - generic [ref=e28]:
        - button "toggle playback rate" [ref=e29] [cursor=pointer]: 1.0x
        - button "rewind 10 seconds" [ref=e30] [cursor=pointer]:
          - img [ref=e31]
        - button "toggle play and pause" [ref=e33] [cursor=pointer]:
          - img [ref=e34]
        - button "forward 10 seconds" [ref=e36] [cursor=pointer]:
          - img [ref=e37]
        - button "more controls" [ref=e39] [cursor=pointer]:
          - img [ref=e40]
      - generic [ref=e42]:
        - generic [ref=e43]:
          - generic [ref=e44]: loading
          - img [ref=e45]
        - generic [ref=e47]: 00:00/01:59
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Audioguide Functional Tests', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.text()}`));
  6  |     page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));
  7  |     await page.goto('/');
  8  |   });
  9  | 
  10 |   test('should display the correct metadata', async ({ page }) => {
  11 |     await expect(page.locator('#artwork-title')).toHaveText('Il Giardino Ducale');
  12 |     await expect(page.locator('#artwork-artist')).toContainText('Guido Carmignani');
  13 |   });
  14 | 
  15 |   test('should load the artwork image', async ({ page }) => {
  16 |     const image = page.locator('.image-container img');
  17 |     await expect(image).toBeVisible();
  18 |     await expect(image).toHaveAttribute('src', 'carmignano.png');
  19 |   });
  20 | 
  21 |   test('should load the transcript from timing.json', async ({ page }) => {
  22 |     const firstWord = page.locator('.word').first();
  23 |     await expect(firstWord).toBeVisible();
  24 |     await expect(firstWord).toHaveText(/Ciao/);
  25 |   });
  26 | 
  27 |   test('clicking a word should seek the audio player', async ({ page }) => {
  28 |     await page.waitForFunction(() => (window as any).player !== undefined);
  29 | 
  30 |     const word = page.locator('.word').nth(1); // "questo"
  31 |     const startTimeStr = await word.getAttribute('data-start');
  32 |     const startTime = parseFloat(startTimeStr || '0');
  33 |     
  34 |     // Trigger click via evaluate to ensure internal handler is called
  35 |     await word.evaluate((el) => (el as HTMLElement).click());
  36 |     
  37 |     // Wait for the player time to be close to the start time
  38 |     await page.waitForFunction((expected) => {
  39 |       const p = (window as any).player;
  40 |       return p && Math.abs(p.currentTime - expected) < 1.0;
  41 |     }, startTime, { timeout: 10000 });
  42 | 
  43 |     const currentTime = await page.evaluate(() => (window as any).player.currentTime);
> 44 |     expect(currentTime).toBeGreaterThan(0); // At least moved from 0
     |                         ^ Error: expect(received).toBeGreaterThan(expected)
  45 |   });
  46 | 
  47 |   test('the word should highlight when audio plays', async ({ page }) => {
  48 |     await page.waitForFunction(() => window.player !== undefined);
  49 |     const word = page.locator('.word').first();
  50 |     
  51 |     await word.click();
  52 | 
  53 |     // The first word "Ciao," starts at 0.0
  54 |     await expect(word).toHaveClass(/active/, { timeout: 10000 });
  55 |   });
  56 | 
  57 |   test('layout should be responsive (mobile)', async ({ page, isMobile }) => {
  58 |     if (isMobile) {
  59 |       const main = page.locator('main');
  60 |       const flexDirection = await main.evaluate((el) => window.getComputedStyle(el).flexDirection);
  61 |       expect(flexDirection).toBe('column');
  62 |     }
  63 |   });
  64 | 
  65 |   test('should trigger annotations and zooming', async ({ page }) => {
  66 |     await page.waitForFunction(() => (window as any).player !== undefined);
  67 |     
  68 |     // Seek to 12s (where a circle annotation starts in our sample data)
  69 |     await page.evaluate(() => {
  70 |       (window as any).player.seek(12);
  71 |       (window as any).player.play();
  72 |     });
  73 | 
  74 |     // Wait for annotation to appear in SVG
  75 |     const circle = page.locator('#annotation-layer circle');
  76 |     await expect(circle).toBeVisible({ timeout: 10000 });
  77 |     
  78 |     // Check if zoom (transform) is applied to image
  79 |     const image = page.locator('#artwork-image');
  80 |     const transform = await image.evaluate((el) => window.getComputedStyle(el).transform);
  81 |     expect(transform).not.toBe('none');
  82 |     expect(transform).toContain('matrix'); // scale/translate results in matrix
  83 |   });
  84 | });
  85 | 
```