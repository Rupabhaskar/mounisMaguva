import { resolveWhatsAppImageFetchUrl } from "@/lib/product-images";

/**
 * Copy a product image to the clipboard so the customer can paste it in WhatsApp.
 * @param {string | null | undefined} imageSrc
 * @returns {Promise<boolean>}
 */
export async function copyProductImageToClipboard(imageSrc) {
  if (typeof navigator === "undefined" || !navigator.clipboard?.write) {
    return false;
  }

  const url = resolveWhatsAppImageFetchUrl(imageSrc);
  if (!url) return false;

  try {
    const response = await fetch(url);
    if (!response.ok) return false;

    const blob = await response.blob();
    const type = blob.type?.startsWith("image/") ? blob.type : "image/png";

    await navigator.clipboard.write([new ClipboardItem({ [type]: blob })]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copy the first product photo for WhatsApp paste. Image links for all items stay in the message text.
 * @param {Array<string | null | undefined>} imageSources
 */
export async function copyProductImagesForWhatsApp(imageSources) {
  const unique = [...new Set(imageSources.map((src) => src).filter(Boolean))];
  if (!unique.length) {
    return { copied: 0, total: 0 };
  }

  const copied = (await copyProductImageToClipboard(unique[0])) ? 1 : 0;
  return { copied, total: unique.length };
}

function getPasteHint({ copied, total }) {
  if (copied <= 0) return "";

  if (total > 1) {
    return "📷 First product photo copied — paste it in this chat (Ctrl+V). Product links are in the message.\n\n";
  }

  return "📷 Product photo copied — paste it in this chat (Ctrl+V) for reference.\n\n";
}

function prependWhatsAppMessage(url, prefix) {
  if (!prefix) return url;

  try {
    const parsed = new URL(url);
    const current = parsed.searchParams.get("text") || "";
    parsed.searchParams.set("text", `${prefix}${current}`);
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Copy product image(s) to clipboard, then open WhatsApp with the order/inquiry message.
 * @param {{ url: string; imageSources?: Array<string | null | undefined> }} options
 */
export async function openWhatsAppWithProductImages({ url, imageSources = [] }) {
  if (typeof window === "undefined") return;

  // Keep the user gesture on mobile: open the tab immediately, then navigate.
  const popup = window.open("", "_blank");

  const result = await copyProductImagesForWhatsApp(imageSources);
  const finalUrl = prependWhatsAppMessage(url, getPasteHint(result));

  if (popup) {
    popup.location.href = finalUrl;
  } else {
    window.location.href = finalUrl;
  }
}
