"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ORDER_STATUSES } from "@/lib/admin-models";
import { buildWhatsAppOrderMessage, getWhatsAppOrderUrl } from "@/lib/whatsapp";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  const [order, setOrder] = useState(null);
  const [itemsJson, setItemsJson] = useState("[]");

  useEffect(() => {
    async function loadOrder() {
      const response = await fetch(`/api/admin/orders/${orderId}`, { cache: "no-store" });
      const data = await response.json();
      setOrder(data.order || null);
      setItemsJson(JSON.stringify(data.order?.items || [], null, 2));
    }
    if (orderId) loadOrder();
  }, [orderId]);

  const parsedItems = useMemo(() => {
    try {
      return JSON.parse(itemsJson || "[]");
    } catch {
      return [];
    }
  }, [itemsJson]);

  const whatsappMessage = useMemo(() => {
    if (!order) return "";
    return buildWhatsAppOrderMessage(parsedItems, {
      name: order.customerName,
      phone: order.customerPhone,
      note: order.note,
    });
  }, [order, parsedItems]);

  const whatsappUrl = useMemo(() => {
    if (!order) return "#";
    return getWhatsAppOrderUrl(parsedItems, {
      name: order.customerName,
      phone: order.customerPhone,
      note: order.note,
    });
  }, [order, parsedItems]);

  async function saveOrder(event) {
    event.preventDefault();
    if (!order) return;
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...order,
        items: parsedItems,
        whatsappMessagePreview: whatsappMessage,
      }),
    });
    router.push("/admin/orders");
    router.refresh();
  }

  if (!order) return <p className="text-sm text-[var(--color-muted)]">Loading...</p>;

  return (
    <section className="space-y-4">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-primary)]">
        Manage Order
      </h1>
      <form onSubmit={saveOrder} className="space-y-4 rounded-xl border border-[var(--color-border)] bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="input-field"
            value={order.customerName || ""}
            onChange={(e) => setOrder((prev) => ({ ...prev, customerName: e.target.value }))}
            placeholder="Customer name"
          />
          <input
            className="input-field"
            value={order.customerPhone || ""}
            onChange={(e) => setOrder((prev) => ({ ...prev, customerPhone: e.target.value }))}
            placeholder="Customer phone"
          />
          <select
            className="input-field"
            value={order.status || "new"}
            onChange={(e) => setOrder((prev) => ({ ...prev, status: e.target.value }))}
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <textarea
          className="input-field min-h-24"
          value={order.note || ""}
          onChange={(e) => setOrder((prev) => ({ ...prev, note: e.target.value }))}
          placeholder="Internal note"
        />
        <div>
          <p className="mb-1 text-sm font-medium">Items JSON</p>
          <textarea
            className="input-field min-h-44 font-mono text-xs"
            value={itemsJson}
            onChange={(e) => setItemsJson(e.target.value)}
          />
        </div>
        <button className="btn-primary" type="submit">
          Save order
        </button>
      </form>

      <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
        <p className="text-sm font-medium">WhatsApp message preview</p>
        <pre className="mt-2 whitespace-pre-wrap text-xs text-[var(--color-muted)]">{whatsappMessage}</pre>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-outline mt-3 inline-flex text-xs"
        >
          Open in WhatsApp
        </a>
      </div>
    </section>
  );
}
