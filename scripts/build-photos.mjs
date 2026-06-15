import { readdir, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = path.resolve('src/assets/photosrc');
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
