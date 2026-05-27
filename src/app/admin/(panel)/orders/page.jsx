"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ORDER_STATUSES } from "@/lib/admin-models";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  async function loadOrders() {
    setLoading(true);
    const response = await fetch("/api/admin/orders", { cache: "no-store" });
    const data = await response.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  async function createOrder(event) {
    event.preventDefault();
    await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        customerPhone,
        status: "new",
        items: [],
      }),
    });
    setCustomerName("");
    setCustomerPhone("");
    loadOrders();
  }

  return (
    <section className="space-y-4">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-primary)]">
        Orders
      </h1>

      <form onSubmit={createOrder} className="rounded-xl border border-[var(--color-border)] bg-white p-4">
        <p className="text-sm font-medium">Create Manual Order</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input
            className="input-field"
            placeholder="Customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <input
            className="input-field"
            placeholder="Customer phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
        </div>
        <button className="btn-primary mt-3" type="submit">
          Create
        </button>
      </form>

      <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
        {loading ? (
          <p className="text-sm text-[var(--color-muted)]">Loading...</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] p-3"
              >
                <div>
                  <p className="text-sm font-semibold">{order.customerName || "Untitled order"}</p>
                  <p className="text-xs text-[var(--color-muted)]">{order.customerPhone || "-"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[var(--color-cream)] px-3 py-1 text-xs capitalize">
                    {ORDER_STATUSES.includes(order.status) ? order.status : "new"}
                  </span>
                  <Link className="btn-outline text-xs" href={`/admin/orders/${order.id}`}>
                    Manage
                  </Link>
                </div>
              </div>
            ))}
            {!orders.length && <p className="text-sm text-[var(--color-muted)]">No orders yet.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
