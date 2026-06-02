import { maguvaImage } from "@/lib/images";

/**
 * Images linked to product colors.
 * @typedef {Record<string, string[]>} ColorImagesMap
 */

const FALLBACK_THUMBNAIL = maguvaImage(1);

function cleanImageUrl(value) {
  if (value == null) return "";
  return typeof value === "string" ? value.trim() : String(value).trim();
}

function cleanImageList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(cleanImageUrl).filter(Boolean);
}

/** Encode spaces in local public paths so Next.js Image can build a valid URL */
function encodeLocalImagePath(path) {
  const segments = path.split("/").filter(Boolean);
  if (!segments.length) return "";
  try {
    return `/${segments.map((segment) => encodeURIComponent(decodeURIComponent(segment))).join("/")}`;
  } catch {
    return `/${segments.map(encodeURIComponent).join("/")}`;
  }
}

/**
 * Returns a src safe for next/image, or fallback when invalid.
 * @param {string | null | undefined} src
 * @param {string | null} [fallback]
 */
export function normalizeProductImageSrc(src, fallback = FALLBACK_THUMBNAIL) {
  const trimmed = cleanImageUrl(src);
  if (!trimmed) return fallback;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return new URL(trimmed).toString();
    } catch {
      return fallback;
    }
  }

  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  try {
    new URL(path, "http://localhost");
  } catch {
    return fallback;
  }

  return encodeLocalImagePath(path);
}

function normalizeImageList(list) {
  return cleanImageList(list)
    .map((url) => normalizeProductImageSrc(url, null))
    .filter(Boolean);
}

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
  const legacy = cleanImageList(product?.images);
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
    return normalizeImageList(map[colorLabel]);
  }
  const colors = product?.colors || [];
  if (colors[0] && map[colors[0]]?.length) {
    return normalizeImageList(map[colors[0]]);
  }
  const flat = normalizeImageList(Object.values(map).flat());
  if (flat.length) return flat;
  return normalizeImageList(product?.images);
}

/** First image for cards and listings */
export function getProductThumbnail(product) {
  const images = getImagesForColor(product, product?.colors?.[0] || product?.color);
  for (const image of images) {
    const normalized = normalizeProductImageSrc(image, null);
    if (normalized) return normalized;
  }
  return normalizeProductImageSrc(FALLBACK_THUMBNAIL);
}

/** All unique images across colors (for SEO / fallback) */
export function getAllProductImages(product) {
  const map = getColorImagesMap(product);
  const fromMap = normalizeImageList(Object.values(map).flat());
  const unique = [...new Set(fromMap)];
  if (unique.length) return unique;
  return normalizeImageList(product?.images);
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
