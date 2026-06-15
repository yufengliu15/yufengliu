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
