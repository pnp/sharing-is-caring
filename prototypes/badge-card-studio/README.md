# Community Badge Card Studio

A dependency-free prototype for turning community recognition badges into personalized social cards.

## Run locally

Serve the repository root so the prototype can resolve the shared badge asset:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173/prototypes/badge-card-studio/`.

## Current prototype

- Live, high-resolution canvas rendering (1200 × 1500)
- Name, role, earned date, and visual theme controls
- PNG and JPG downloads rendered entirely in the browser
- Six mix-and-match art themes with distinct palettes and textures
- Theme-specific typography colors and surfaces for consistent contrast
- Progressive three-section editor with one accordion section open at a time
- Optional earned date, disabled by default
- Eight evergreen motion modes plus seasonal Fall Leaves and Winter Snow editions
- Five-second MP4 or WebM export using native browser recording
- Device sharing through the Web Share API with a download-and-copy fallback
- Per-badge default social copy with one-click copying
- Responsive layout and reduced-motion support
- No authentication, storage, tracking, or uploads

Video export intentionally uses the browser's native `MediaRecorder` support first. No FFmpeg dependency is loaded in this phase; `ffmpeg.wasm` can later be added as a lazy-loaded conversion fallback where needed.

Badge metadata and additional badge images can be moved into a small JSON catalog in the next iteration. Credly verification can later populate the same name/date/card model without changing the export flow.
