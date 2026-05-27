"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import { getProductThumbnail } from "@/lib/product-images";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setLoading(true);
    const response = await fetch("/api/admin/products", { cache: "no-store" });
    const data = await response.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.sku?.toLowerCase().includes(q) ||
        item.slug?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q),
    );
  }, [products, search]);

  async function deleteProduct(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-primary)]">
            Products
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {loading ? "Loading..." : `${filtered.length} product${filtered.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm">
          Add product
        </Link>
      </div>

      <input
        className="input-field max-w-md"
        placeholder="Search name, SKU, slug, category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
        {loading ? (
          <p className="p-6 text-sm text-[var(--color-muted)]">Loading products...</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-[var(--color-muted)]">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-[var(--color-border)] bg-[var(--color-cream)]/50 text-xs uppercase tracking-wide text-[var(--color-muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">SKU</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const thumb = getProductThumbnail(product);
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-[var(--color-border)]/60 last:border-0 hover:bg-[var(--color-cream)]/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface)]">
                            <Image
                              src={thumb}
                              alt={product.name || "Product"}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[var(--color-text)] line-clamp-2">
                              {product.name}
                            </p>
                            <p className="mt-0.5 text-xs text-[var(--color-muted)] capitalize">
                              /{product.slug}
                            </p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {product.isNew ? (
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                                  New
                                </span>
                              ) : null}
                              {product.isBestSeller ? (
                                <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-primary)]">
                                  Best seller
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-muted)]">{product.sku || "—"}</td>
                      <td className="px-4 py-3 capitalize text-[var(--color-muted)]">
                        {product.category?.replace(/-/g, " ") || "—"}
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--color-primary)]">
                        {formatPrice(product.price || 0)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            product.inStock !== false
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.inStock !== false ? "In stock" : "Out of stock"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="btn-outline text-xs"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="btn-outline text-xs text-red-600 hover:border-red-300 hover:text-red-700"
                            onClick={() => deleteProduct(product.id, product.name)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
