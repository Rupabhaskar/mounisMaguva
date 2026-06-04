import { site } from "./site";
import { formatPrice } from "./format";
import { getWhatsAppImageReference } from "./product-images";

/**
 * @param {import('./products').Product[]} items
 * @param {{ name?: string; phone?: string; note?: string }} customer
 */
export function buildWhatsAppOrderMessage(items, customer = {}) {
  const lines = [
    `Hello ${site.name}!`,
    "",
    "I would like to place an order:",
    "",
  ];

  let total = 0;

  items.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;
    lines.push(
      `${index + 1}. *${item.name}*`,
      `   Code: ${item.sku}`,
      `   Qty: ${item.quantity}${item.size ? ` | Size: ${item.size}` : ""}`,
      `   Price: ${formatPrice(item.price)} each`,
      `   Subtotal: ${formatPrice(lineTotal)}`,
    );

    const productRef = getWhatsAppImageReference(item.image, { slug: item.slug });
    if (productRef) {
      lines.push(
        item.slug ? `   View product: ${productRef}` : `   Photo: ${productRef}`,
      );
    }

    lines.push("");
  });

  lines.push(`*Estimated total: ${formatPrice(total)}*`);
  lines.push("");
  lines.push("Please confirm availability and payment details.");

  if (customer.name) {
    lines.push("");
    lines.push(`Name: ${customer.name}`);
  }
  if (customer.phone) {
    lines.push(`Phone: ${customer.phone}`);
  }
  if (customer.note) {
    lines.push("");
    lines.push(`Note: ${customer.note}`);
  }

  return lines.join("\n");
}

/**
 * @param {import('./products').Product[]} items
 * @param {{ name?: string; phone?: string; note?: string }} customer
 */
export function getWhatsAppOrderUrl(items, customer = {}) {
  const message = buildWhatsAppOrderMessage(items, customer);
  const phone = site.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppInquiryUrl(productName, sku, imageSrc, slug) {
  const lines = [
    `Hi ${site.name}! I'm interested in *${productName}* (${sku}). Is it available? Please share more details.`,
  ];

  const productRef = getWhatsAppImageReference(imageSrc, { slug });
  if (productRef) {
    lines.push("");
    lines.push(slug ? `View product: ${productRef}` : `Photo: ${productRef}`);
  }

  const phone = site.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function getWhatsAppChatUrl() {
  const phone = site.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}`;
}
