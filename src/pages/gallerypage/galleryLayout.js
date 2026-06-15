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
