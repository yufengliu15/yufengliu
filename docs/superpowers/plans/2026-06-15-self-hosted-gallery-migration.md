# Self-Hosted Gallery Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Google Drive image backend with self-hosted, web-optimized photos served by GitHub Pages' CDN, removing all throttling, quality, and leaked-secret problems.

**Architecture:** A Node build script (`sharp`) turns original photos dropped in `photos-src/` into small grid thumbnails + large lightbox images + a `manifest.json`, all written to `public/gallery/` and committed. The React gallery fetches the manifest, gets exact aspect ratios upfront (no on-load reflow), and reuses the existing justified-rows layout and Fancybox lightbox. All Drive/OAuth/JWT code and the leaked service-account key are deleted.

**Tech Stack:** React (CRA), `sharp` (image processing, dev-only), `@fancyapps/ui` (already installed), Node built-in test runner + Jest (CRA).

---

## File Structure

- Create: `scripts/build-photos.mjs` — the resize/convert/manifest build script. Exports `buildPhotos()` and runs when invoked directly.
- Create: `scripts/build-photos.test.mjs` — Node `--test` integration test for the build script.
- Create: `src/pages/gallerypage/galleryLayout.js` — pure helpers (`manifestToItems`, `buildRows`) extracted from the component for testability.
- Create: `src/pages/gallerypage/galleryLayout.test.js` — Jest unit tests for the helpers.
- Modify: `src/pages/gallerypage/GalleryPage.jsx` — rewrite to fetch the manifest and render; delete all Drive/gapi/JWT code.
- Modify: `package.json` — add `sharp` (dev), add `photos` + `test:photos` scripts, remove `gapi-script`, `jsrsasign`, `buffer`.
- Modify: `.gitignore` — drop the `src/config.js` line, add `photos-src/`.
- Delete: `src/config.js` — the leaked service-account private key (gitignored, local only).

**Manifest entry shape (locked for all tasks):**

```json
{
  "base": "P7130687",
  "thumb": "/gallery/P7130687-800.webp",
  "full": "/gallery/P7130687-2048.webp",
  "width": 2048,
  "height": 1365
}
```

`manifestToItems` maps each entry to `{ id: base, thumbnailUrl: thumb, lightboxUrl: full, ar: width / height }`.

---

## Task 1: Photo build script

**Files:**
- Create: `scripts/build-photos.mjs`
- Test: `scripts/build-photos.test.mjs`

- [ ] **Step 1: Install sharp as a dev dependency**

Run: `npm install --save-dev sharp`
Expected: `sharp` appears under `devDependencies` in `package.json`.

- [ ] **Step 2: Write the build script**

Create `scripts/build-photos.mjs`:

```js
import { readdir, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = path.resolve('photos-src');
const OUT_DIR = path.resolve('public/gallery');
const THUMB_MAX = 800;   // longest side of the grid thumbnail
const FULL_MAX = 2048;   // longest side of the lightbox image
const QUALITY = 80;      // webp quality
const INPUT_RE = /\.(jpe?g|png|tiff?|webp)$/i;

function baseName(file) {
  return path.basename(file, path.extname(file)).replace(/[^\w-]+/g, '-');
}

// Read every original in srcDir, emit a thumb + full webp per photo into
// outDir, and write outDir/manifest.json. Returns the manifest array.
export async function buildPhotos({ srcDir = SRC_DIR, outDir = OUT_DIR } = {}) {
  if (!existsSync(srcDir)) {
    throw new Error(`Source folder not found: ${srcDir}. Create it and drop original photos in.`);
  }
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(srcDir)).filter((f) => INPUT_RE.test(f)).sort();
  const manifest = [];

  for (const file of files) {
    const base = baseName(file);
    const thumbName = `${base}-${THUMB_MAX}.webp`;
    const fullName = `${base}-${FULL_MAX}.webp`;
    const pipeline = sharp(path.join(srcDir, file)).rotate(); // apply EXIF orientation

    const fullInfo = await pipeline
      .clone()
      .resize(FULL_MAX, FULL_MAX, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(path.join(outDir, fullName));

    await pipeline
      .clone()
      .resize(THUMB_MAX, THUMB_MAX, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(path.join(outDir, thumbName));

    manifest.push({
      base,
      thumb: `/gallery/${thumbName}`,
      full: `/gallery/${fullName}`,
      width: fullInfo.width,
      height: fullInfo.height,
    });
  }

  await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  return manifest;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildPhotos()
    .then((m) => console.log(`Built ${m.length} photos into public/gallery/`))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
```

- [ ] **Step 3: Write the failing test**

Create `scripts/build-photos.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { buildPhotos } from './build-photos.mjs';

test('buildPhotos resizes, converts to webp, and writes a manifest', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'photos-'));
  const srcDir = path.join(root, 'src');
  const outDir = path.join(root, 'out');
  await mkdir(srcDir, { recursive: true });

  await sharp({ create: { width: 3000, height: 2000, channels: 3, background: 'red' } })
    .jpeg()
    .toFile(path.join(srcDir, 'P1000001.jpg'));

  const manifest = await buildPhotos({ srcDir, outDir });

  assert.equal(manifest.length, 1);
  const entry = manifest[0];
  assert.equal(entry.base, 'P1000001');
  assert.equal(entry.thumb, '/gallery/P1000001-800.webp');
  assert.equal(entry.full, '/gallery/P1000001-2048.webp');
  assert.equal(entry.width, 2048);
  assert.ok(Math.abs(entry.width / entry.height - 1.5) < 0.01, '3:2 aspect ratio preserved');

  const full = await sharp(path.join(outDir, 'P1000001-2048.webp')).metadata();
  assert.equal(full.format, 'webp');
  assert.equal(full.width, 2048);

  const written = JSON.parse(await readFile(path.join(outDir, 'manifest.json'), 'utf8'));
  assert.equal(written.length, 1);

  await rm(root, { recursive: true, force: true });
});
```

- [ ] **Step 4: Run the test**

Run: `node --test scripts/build-photos.test.mjs`
Expected: PASS (1 test). (Requires Node 18+.)

- [ ] **Step 5: Commit**

```bash
git add scripts/build-photos.mjs scripts/build-photos.test.mjs package.json package-lock.json
git commit -m "feat: add photo build script (resize + webp + manifest)"
```

---

## Task 2: Extract and test gallery layout helpers

**Files:**
- Create: `src/pages/gallerypage/galleryLayout.js`
- Test: `src/pages/gallerypage/galleryLayout.test.js`

- [ ] **Step 1: Write the helpers module**

Create `src/pages/gallerypage/galleryLayout.js`:

```js
export const ROW_TARGET_HEIGHT = 240; // ideal row height in px before justification
export const ROW_GAP = 6;             // px gutter between photos, both axes

// Convert a manifest (array of {base, thumb, full, width, height}) into the
// item shape the gallery renders. Aspect ratio comes from the manifest, so
// there is no on-load reflow.
export function manifestToItems(manifest) {
  return (manifest || [])
    .filter((m) => m && m.width > 0 && m.height > 0)
    .map((m) => ({
      id: m.base,
      thumbnailUrl: m.thumb,
      lightboxUrl: m.full,
      ar: m.width / m.height,
    }));
}

// Greedily pack items into rows, then scale each full row so it spans the
// container width exactly (flush left and right). Each item keeps its aspect
// ratio. The final partial row stays at the target height.
export function buildRows(items, containerWidth) {
  if (!containerWidth || !items || items.length === 0) return [];
  const rows = [];
  let row = [];
  let arSum = 0;
  for (const item of items) {
    row.push(item);
    arSum += item.ar;
    const naturalRowWidth = arSum * ROW_TARGET_HEIGHT + (row.length - 1) * ROW_GAP;
    if (naturalRowWidth >= containerWidth) {
      const height = (containerWidth - (row.length - 1) * ROW_GAP) / arSum;
      rows.push({ items: row, height });
      row = [];
      arSum = 0;
    }
  }
  if (row.length) rows.push({ items: row, height: ROW_TARGET_HEIGHT });
  return rows;
}
```

- [ ] **Step 2: Write the failing tests**

Create `src/pages/gallerypage/galleryLayout.test.js`:

```js
import { manifestToItems, buildRows, ROW_GAP } from './galleryLayout';

test('manifestToItems maps fields and computes aspect ratio', () => {
  const items = manifestToItems([
    { base: 'a', thumb: '/gallery/a-800.webp', full: '/gallery/a-2048.webp', width: 3000, height: 2000 },
  ]);
  expect(items).toEqual([
    { id: 'a', thumbnailUrl: '/gallery/a-800.webp', lightboxUrl: '/gallery/a-2048.webp', ar: 1.5 },
  ]);
});

test('manifestToItems drops entries without dimensions', () => {
  expect(manifestToItems([{ base: 'x', width: 0, height: 0 }])).toEqual([]);
});

test('buildRows makes every full row span the container width exactly', () => {
  const ars = [1.5, 0.75, 1.0, 1.78];
  const items = Array.from({ length: 10 }, (_, i) => ({ id: String(i), ar: ars[i % ars.length] }));
  const WIDTH = 820;
  const rows = buildRows(items, WIDTH);
  rows.slice(0, -1).forEach((row) => {
    const total =
      row.items.reduce((sum, it) => sum + it.ar * row.height, 0) +
      (row.items.length - 1) * ROW_GAP;
    expect(Math.abs(total - WIDTH)).toBeLessThan(0.5);
  });
});

test('buildRows returns empty when width is unknown', () => {
  expect(buildRows([{ id: 'a', ar: 1.5 }], 0)).toEqual([]);
});
```

- [ ] **Step 3: Run the tests**

Run: `CI=true npx react-scripts test --watchAll=false src/pages/gallerypage/galleryLayout.test.js`
Expected: PASS (4 tests).

- [ ] **Step 4: Commit**

```bash
git add src/pages/gallerypage/galleryLayout.js src/pages/gallerypage/galleryLayout.test.js
git commit -m "feat: extract + test gallery layout helpers"
```

---

## Task 3: Rewrite GalleryPage to use the manifest

**Files:**
- Modify: `src/pages/gallerypage/GalleryPage.jsx` (full rewrite)

- [ ] **Step 1: Replace the component**

Overwrite `src/pages/gallerypage/GalleryPage.jsx` with:

```jsx
import React, { useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react';
import useAnimateRoute from '../../hooks/useAnimatedRoute';
import './gallerypage.css';
import { Logo } from '../../components';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { manifestToItems, buildRows } from './galleryLayout';

const MANIFEST_URL = `${process.env.PUBLIC_URL}/gallery/manifest.json`;

function GalleryPage() {
  const [items, setItems] = useState([]);
  const animationClass = useAnimateRoute();

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Load the photo manifest (filenames + dimensions) generated by `npm run photos`.
  useEffect(() => {
    let cancelled = false;
    fetch(MANIFEST_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (!cancelled) setItems(manifestToItems(data));
      })
      .catch((err) => console.error('Failed to load gallery manifest:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  // Track the container's inner width so rows can justify to it on resize.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Open a full-resolution in-page lightbox on click.
  useEffect(() => {
    Fancybox.bind('[data-fancybox="gallery"]', {});
    return () => {
      Fancybox.unbind('[data-fancybox="gallery"]');
      Fancybox.close();
    };
  }, []);

  const rows = useMemo(() => buildRows(items, containerWidth), [items, containerWidth]);

  return (
    <div className={animationClass}>
      <div className='gallerypage-body'>
        <h1>Gallery</h1>
        <hr></hr>
        <p>Though I am just beginning my journey in photography, the allure of immortalizing the beauty of fleeting moments fuels my passion to persist.</p>
        <p> So, here are all the photos that I am proud of.</p>
        <p>Camera: Olympus E-PL6</p>
        <p>Lens: Olympus E-PL6 Kit Lens 14-42mm</p>
        <br></br>
        <b><span id="images-count">{items.length}</span></b> pictures
        <div id="images-container" ref={containerRef}>
          {rows.map((row, ri) => (
            <div className="gallery-row" key={ri} style={{ height: row.height }}>
              {row.items.map((item) => (
                <a
                  key={item.id}
                  className="gallery-item"
                  style={{ width: item.ar * row.height }}
                  target="_blank"
                  rel="noreferrer"
                  href={`${process.env.PUBLIC_URL}${item.lightboxUrl}`}
                  data-fancybox="gallery"
                  data-type="image"
                >
                  <img
                    src={`${process.env.PUBLIC_URL}${item.thumbnailUrl}`}
                    alt="a picture"
                    className="thumbnail"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Logo></Logo>
    </div>
  );
}

export default GalleryPage;
```

- [ ] **Step 2: Verify no Drive references remain**

Run: `grep -nE "privateData|gapi|KJUR|jsrsasign|generateJWT|config" src/pages/gallerypage/GalleryPage.jsx`
Expected: no output.

- [ ] **Step 3: Verify it compiles**

Run: `CI=false npm run build 2>&1 | grep -iE "compiled|Module not found|Failed to compile" | head`
Expected: a "Compiled" line, no "Module not found" / "Failed to compile".

- [ ] **Step 4: Commit**

```bash
git add src/pages/gallerypage/GalleryPage.jsx
git commit -m "feat: render gallery from local manifest, drop Drive backend"
```

---

## Task 4: Remove dead dependencies, config, and gitignore the source folder

**Files:**
- Delete: `src/config.js`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Confirm config.js is unused anywhere else**

Run: `grep -rn "config" src/ | grep -v "gallerypage.css"`
Expected: no import of `../../config` or `./config` (only unrelated matches, if any).

- [ ] **Step 2: Delete the leaked secret file**

Run: `rm src/config.js`

- [ ] **Step 3: Edit package.json scripts and dependencies**

In `package.json`, remove these three lines from `dependencies`:

```json
    "buffer": "^6.0.3",
    "gapi-script": "^1.2.0",
    "jsrsasign": "^11.1.0",
```

Add to `scripts` (after the existing `"start"` line):

```json
    "photos": "node scripts/build-photos.mjs",
    "test:photos": "node --test scripts/build-photos.test.mjs",
```

- [ ] **Step 4: Update .gitignore**

In `.gitignore`, remove the line `src/config.js` and add a new line:

```
photos-src/
```

- [ ] **Step 5: Reinstall to prune removed packages and verify build**

Run: `npm install && CI=false npm run build 2>&1 | grep -iE "compiled|Module not found|Failed to compile" | head`
Expected: a "Compiled" line, no errors. (Removing `buffer`/`gapi-script`/`jsrsasign` is safe because no code imports them anymore.)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove Drive deps + leaked config, gitignore photos-src"
```

---

## Task 5: Migrate the real photos and ship

**Files:** none (operational steps).

- [ ] **Step 1: Pull the originals out of Drive**

Download all photos from the Drive gallery folder to your machine.

- [ ] **Step 2: Drop originals into the source folder**

```bash
mkdir -p photos-src
# copy the downloaded originals into photos-src/
```

- [ ] **Step 3: Generate the web assets**

Run: `npm run photos`
Expected: `Built N photos into public/gallery/` and `public/gallery/` now contains `*-800.webp`, `*-2048.webp`, and `manifest.json`.

- [ ] **Step 4: Smoke-test locally**

Run: `npm start`, open `/gallery`.
Expected: justified grid loads from local webps (flush right edge), clicking a photo opens the full-res in-page Fancybox lightbox, no console errors, no network calls to `drive.google.com` or `googleusercontent.com`.

- [ ] **Step 5: Commit the generated gallery**

```bash
git add public/gallery
git commit -m "feat: add web-optimized gallery photos + manifest"
```

- [ ] **Step 6: Deploy**

Run: `npm run deploy`
Expected: gh-pages publishes; `https://yufengliu.tech/gallery` shows the new gallery.

- [ ] **Step 7: Rotate the now-unused Drive key**

The service-account private key that used to live in `src/config.js` shipped in every old build. Revoke/rotate it in Google Cloud Console (IAM > Service Accounts > Keys) and regenerate the API key, so old cached bundles can't use it. (This is the previously-flagged security task; it's now safe because nothing depends on Drive.)

---

## Notes / tuning knobs

- Grid sharpness vs weight: `THUMB_MAX` (800) in `scripts/build-photos.mjs`. Lightbox quality: `FULL_MAX` (2048) and `QUALITY` (80).
- Row size/gutter: `ROW_TARGET_HEIGHT` (240) and `ROW_GAP` (6) in `galleryLayout.js`.
- Ordering: photos are sorted by filename ascending in the build script. Change the `.sort()` in `buildPhotos` (for example, reverse for newest-first) if desired.
- JPEG fallback: if you ever want to avoid webp, change `.webp({ quality })` calls to `.jpeg({ quality, mozjpeg: true })` and the `.webp` extensions accordingly.
