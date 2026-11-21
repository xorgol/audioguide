# E-MUSE Audioguide & Studio

An interactive, browser-based multimedia audioguide player and multitrack timeline editor built with zero-build static HTML/JS.

- **Live Player:** https://xorgol.github.io/audioguide/
- **Live Studio Editor:** https://xorgol.github.io/audioguide/editor.html

## Features

### Player (`index.html` + `player.js`)
- **Synced Visual Storytelling:** Animates zoom, pan, blur/grayscale focus effects, and multiple simultaneous SVG annotations (circles, pointers, polygons) in sync with audio playback.
- **Multi-Media Timeline:** Switches seamlessly between background images, synced videos, and interactive 3D models (`.glb` / `.gltf` via `<model-viewer>`, including camera-orbit keyframes).
- **Subtitles & Interactive Transcript:** Displays word-level synced subtitles or a clickable transcript (`timing.json` / `.vtt`), plus timed text overlays (`textCues`).
- **Accessible Audio Controls (`player.js`):** Lightweight, dependency-free player with play/pause, `-10s` / `+10s`, playback speed (`0.75x`–`2x`), seek slider, and `Space` play/pause shortcut.
- **Flexible Loading:** Loads `audioguide.json` (or `?project=<url>`, `#project=<base64>`, or embedded `window.__EMBEDDED_PROJECT__`), and falls back to `annotations.json` + `timing.json` + `carmignano.png` + `demo.mp3`.

### Audioguide Studio (`editor.html`)
- **Multitrack Timeline:**
  - Individual rows for **Media** (`M1`, `M2`, …), **Audio** (`A1`, `A2`, …), **Text** (`T1`, `T2`, …), and **FX / Annotations** (`FX1`, `FX2`, …).
  - Drag `⋮⋮` track handles up or down to change layering order (top track has highest priority).
  - Drag clips to move, drag right edges to resize, scrub the ruler to preview at any timestamp, and snap to the playhead or adjacent edges (hold `Shift` to bypass snapping).
- **Annotate Tab:**
  - Create multiple simultaneous annotation layers (`+ Layer`).
  - **Circle:** Click and drag on the artwork to set center and radius; drag the rim to resize.
  - **Polygon:** Click to add vertices, drag handles directly to reposition, double-click a handle to delete it.
  - **Pointer & Zoom Only:** Place minimal pointers or pan/zoom/blur/grayscale transitions.
  - **3D Camera Keyframes:** Capture `<model-viewer>` camera orbit and target (`Capture 3D Camera Orbit`).
- **Info Tab:** Edit `title`, `artist`, `language`, and `description` (synced live to the player).
- **Media Tab:** Add timed `Image`, `Video`, or `3D Model` cues via URL or local file upload (automatically normalizes GitHub `blob` and Dropbox share links).
- **Audio Tab:** Layer multiple audio sources, record voiceover directly from your microphone (`Record Mic`), synthesize speech on the timeline (`Voice Synth` via Web Speech API), or mix tracks into a downloadable `.wav` (`Mix WAV`).
- **Text Tab:** Add timed text overlays and import `.vtt` or `timing.json` captions.
- **Autosave & Undo/Redo:** Automatically saves to `localStorage` with a 50-step undo/redo history.

## Keyboard Shortcuts (`editor.html`)

| Shortcut | Action |
| --- | --- |
| `Space` | Play / Pause |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + C` | Copy selected keyframe |
| `Ctrl/Cmd + X` | Cut selected keyframe |
| `Ctrl/Cmd + V` | Paste keyframe at playhead |
| `Alt + Drag` (keyframe on timeline) | Duplicate and move keyframe |
| `Shift + Drag` (on timeline) | Disable timeline snapping |

## Exporting & Publishing

- **Export Project (`audioguide.json`):** Saves metadata, media cues, audio tracks, text cues, timing data, and all annotation layers.
- **Export Annotations (`annotations.json`):** Exports only the annotation keyframes.
- **Publish Link:** Encodes the project into `index.html#project=...`, copies the URL to your clipboard, and opens it in a new tab (best for projects using hosted URLs).
- **Publish HTML Page:** Generates a self-contained `.html` file from `index.html`, inlining any locally uploaded `blob:` media/audio files as Base64 data URLs.

## Project Structure

- `index.html` — Audioguide player
- `editor.html` — Multitrack Audioguide Studio editor
- `player.js` — Accessible, zero-dependency audio player module
- `annotations.json` / `timing.json` — Default sample annotations and word-level transcript timing
- `generate_captions.py` — Helper script for generating captions/timing
- `tests/` — Playwright functional and accessibility (`@axe-core/playwright`) tests

## Local Development & Testing

Serve the directory with any static HTTP server (required for ES modules and `fetch`), for example:

```bash
npx http-server . -p 8181
```

Then open `http://127.0.0.1:8181/` or `http://127.0.0.1:8181/editor.html`.

To run the Playwright test suite:

```bash
npm install
npm test
```
