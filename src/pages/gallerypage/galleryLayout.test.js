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
