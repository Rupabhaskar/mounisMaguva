import { slugify } from "@/lib/utils";
import { getAllProductImages, normalizeColorImagesPayload } from "@/lib/product-images";

export const ORDER_STATUSES = ["new", "confirmed", "packed", "shipped", "delivered", "cancelled"];
export const BANNER_PLACEMENTS = ["home", "collections"];

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toStringArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

const COLOR_HEX_PALETTE = [
  "#801818",
  "#722F37",
  "#C9A227",
  "#1e3a5f",
  "#98D8C8",
  "#F4C2C2",
  "#FFCBA4",
  "#2d6a4f",
];

function buildColorOptions(labels, inStock = true) {
  return labels.map((label, index) => {
    const text = String(label).trim();
    const abbr = text
      .split(/[\s/&]+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();
    return {
      id: slugify(text) || `color-${index}`,
      label: text,
      abbr: abbr || "CLR",
      hex: COLOR_HEX_PALETTE[index % COLOR_HEX_PALETTE.length],
      available: inStock !== false,
    };
  });
}

function normalizeColorSizesPayload(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const map = {};
  Object.entries(raw).forEach(([color, sizes]) => {
    const list = Array.isArray(sizes)
      ? sizes.map((s) => String(s).trim()).filter(Boolean)
      : [];
    if (list.length) map[color] = list;
  });
  return map;
}

export function normalizeProductInput(payload = {}) {
  const name = String(payload.name || "").trim();
  const colors = toStringArray(payload.colors);
  const inStock = payload.inStock !== false;
  const colorOptions =
    Array.isArray(payload.colorOptions) && payload.colorOptions.length
      ? payload.colorOptions
      : buildColorOptions(colors, inStock);

  const colorImages = normalizeColorImagesPayload(payload.colorImages, colors);
  const productForImages = { colorImages, colors, images: toStringArray(payload.images) };
  const images = getAllProductImages(productForImages);
  const colorSizes = normalizeColorSizesPayload(payload.colorSizes);

  return {
    slug: slugify(payload.slug || name),
    sku: String(payload.sku || "").trim(),
    name,
    description: String(payload.description || "").trim(),
    price: toNumber(payload.price),
    originalPrice: payload.originalPrice ? toNumber(payload.originalPrice) : null,
    category: String(payload.category || "sarees").trim(),
    colorImages,
    colorSizes,
    images,
    fabric: String(payload.fabric || "").trim(),
    colors,
    color: colors[0] || String(payload.color || "").trim(),
    sizes: toStringArray(payload.sizes),
    isNew: Boolean(payload.isNew),
    isBestSeller: Boolean(payload.isBestSeller),
    inStock,
    tags: toStringArray(payload.tags),
    blouse: String(payload.blouse || "").trim(),
    colorOptions,
  };
}

export function normalizeOrderInput(payload = {}) {
  const status = String(payload.status || "new").toLowerCase();
  return {
    customerName: String(payload.customerName || "").trim(),
    customerPhone: String(payload.customerPhone || "").trim(),
    note: String(payload.note || "").trim(),
    status: ORDER_STATUSES.includes(status) ? status : "new",
    items: Array.isArray(payload.items) ? payload.items : [],
    whatsappMessagePreview: String(payload.whatsappMessagePreview || "").trim(),
  };
}

export function normalizeBannerInput(payload = {}) {
  const placement = String(payload.placement || "home");
  return {
    title: String(payload.title || "").trim(),
    subtitle: String(payload.subtitle || "").trim(),
    imageUrl: String(payload.imageUrl || "").trim(),
    href: String(payload.href || "").trim(),
    isActive: Boolean(payload.isActive),
    placement: BANNER_PLACEMENTS.includes(placement) ? placement : "home",
    sortOrder: toNumber(payload.sortOrder),
  };
}

export function normalizeMediaInput(payload = {}) {
  return {
    url: String(payload.url || "").trim(),
    storagePath: String(payload.storagePath || "").trim(),
    usageTags: toStringArray(payload.usageTags),
    altText: String(payload.altText || "").trim(),
  };
}

export function normalizeMediaOverrideInput(payload = {}) {
  return {
    alias: String(payload.alias || "").trim(),
    url: String(payload.url || "").trim(),
  };
}
