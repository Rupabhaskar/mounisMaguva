/**
 * Images linked to product colors.
 * @typedef {Record<string, string[]>} ColorImagesMap
 */

/** @param {import('./products').Product} product */
export function getColorImagesMap(product) {
  if (product?.colorImages && typeof product.colorImages === "object") {
    return product.colorImages;
  }
  const colors = product?.colors?.length
    ? product.colors
    : product?.color
      ? [product.color]
      : [];
  const legacy = Array.isArray(product?.images) ? product.images.filter(Boolean) : [];
  if (colors.length && legacy.length) {
    return { [colors[0]]: legacy };
  }
  return {};
}

/**
 * @param {import('./products').Product} product
 * @param {string} [colorLabel]
 */
export function getImagesForColor(product, colorLabel) {
  const map = getColorImagesMap(product);
  if (colorLabel && map[colorLabel]?.length) {
    return map[colorLabel];
  }
  const colors = product?.colors || [];
  if (colors[0] && map[colors[0]]?.length) {
    return map[colors[0]];
  }
  const flat = Object.values(map).flat();
  if (flat.length) return flat;
  return Array.isArray(product?.images) ? product.images.filter(Boolean) : [];
}

/** First image for cards and listings */
export function getProductThumbnail(product) {
  const images = getImagesForColor(product, product?.colors?.[0] || product?.color);
  return images[0] || "/Maguva Images/image1.jpg";
}

/** All unique images across colors (for SEO / fallback) */
export function getAllProductImages(product) {
  const map = getColorImagesMap(product);
  const fromMap = Object.values(map).flat();
  const unique = [...new Set(fromMap.filter(Boolean))];
  if (unique.length) return unique;
  return Array.isArray(product?.images) ? product.images.filter(Boolean) : [];
}

/**
 * @param {ColorImagesMap} colorImages
 * @param {string[]} colors
 */
export function pruneColorImages(colorImages, colors) {
  const next = {};
  colors.forEach((color) => {
    if (colorImages[color]?.length) {
      next[color] = colorImages[color];
    }
  });
  return next;
}

/**
 * @param {unknown} raw
 * @param {string[]} colors
 */
export function normalizeColorImagesPayload(raw, colors = []) {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const map = {};
    Object.entries(raw).forEach(([key, urls]) => {
      const k = String(key).trim();
      if (!k) return;
      const list = Array.isArray(urls)
        ? urls.map((u) => String(u).trim()).filter(Boolean)
        : String(urls || "")
            .split(",")
            .map((u) => u.trim())
            .filter(Boolean);
      if (list.length) map[k] = list;
    });
    return pruneColorImages(map, colors.length ? colors : Object.keys(map));
  }
  return {};
}
