/**
 * @typedef {Object} ColorOption
 * @property {string} id
 * @property {string} label
 * @property {string} abbr
 * @property {string} hex
 * @property {boolean} available
 */

/**
 * @param {import('./products').Product} product
 * @returns {ColorOption[]}
 */
export function getColorOptions(product) {
  if (product.colorOptions?.length) {
    return product.colorOptions;
  }
  const abbr = product.color
    .split(/[\s/&]+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  return [
    {
      id: "default",
      label: product.color,
      abbr: abbr || "STD",
      hex: "#801818",
      available: product.inStock,
    },
  ];
}

/**
 * @param {import('./products').Product} product
 * @param {number} colorCount
 */
export function getProductBullets(product, colorCount) {
  const bullets = [
    {
      label: "About",
      value: product.description,
    },
    {
      label: "Blouse",
      value: product.blouse ?? "Matching blouse piece included (where applicable)",
    },
    {
      label: "Size support",
      value: product.sizes.join(" · "),
    },
    {
      label: "Total colors",
      value: `${colorCount} shade${colorCount > 1 ? "s" : ""} available`,
    },
  ];
  return bullets;
}

export const productInfoCards = [
  {
    id: "shipping",
    title: "Free Shipping",
    description: "On all orders across India",
    icon: "truck",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-900 [&_svg]:text-emerald-600",
  },
  {
    id: "delivery",
    title: "Delivery",
    description: "Dispatched in 3–5 business days",
    icon: "clock",
    className: "border-sky-200 bg-sky-50 text-sky-900 [&_svg]:text-sky-600",
  },
  {
    id: "color",
    title: "Color note",
    description: "Slight shade variation possible in natural light",
    icon: "alert",
    className: "border-amber-200 bg-amber-50 text-amber-900 [&_svg]:text-amber-600",
  },
  {
    id: "returns",
    title: "Return policy",
    description: "Easy exchanges within 7 days",
    icon: "return",
    className: "border-violet-200 bg-violet-50 text-violet-900 [&_svg]:text-violet-600",
  },
  {
    id: "quality",
    title: "100% Product Quality",
    description: "Handpicked fabrics and careful quality checks on every piece",
    icon: "quality",
    className:
      "border-rose-200 bg-rose-50 text-rose-900 [&_svg]:text-[var(--color-primary)]",
  },
  {
    id: "satisfaction",
    title: "100% Customer Satisfaction",
    description: "We stand behind every order — reach us anytime on WhatsApp",
    icon: "satisfaction",
    className:
      "border-teal-200 bg-teal-50 text-teal-900 [&_svg]:text-teal-600",
  },
];
