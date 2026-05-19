"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatDiscount, formatPrice } from "@/lib/format";
import { getWhatsAppInquiryUrl } from "@/lib/whatsapp";
import { ChevronRight } from "lucide-react";
import { IconWhatsApp } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ProductImageGallery from "@/components/product/ProductImageGallery";

export default function ProductDetail({ product, related = [] }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const discount = formatDiscount(product.originalPrice, product.price);
  const inquiryUrl = getWhatsAppInquiryUrl(product.name, product.sku);

  function handleAddToCart() {
    addItem({
      productId: product.id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size,
      quantity,
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <nav className="text-xs text-[var(--color-muted)] mb-6 flex flex-wrap items-center gap-1">
        <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
        <ChevronRight className="size-3" />
        <Link href="/shop" className="hover:text-[var(--color-primary)]">Shop</Link>
        <ChevronRight className="size-3" />
        <Link href={`/shop/${product.category}`} className="hover:text-[var(--color-primary)] capitalize">
          {product.category}
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-[var(--color-text)] line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
        <ProductImageGallery
          images={product.images}
          alt={product.name}
          isNew={product.isNew}
          discount={discount}
          selectedIndex={selectedImage}
          onSelectIndex={setSelectedImage}
        />

        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">{product.sku}</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-[var(--color-primary)] mt-2 mb-4">
            {product.name}
          </h1>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-semibold text-[var(--color-primary)]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-[var(--color-muted)] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-[var(--color-muted)] leading-relaxed mb-6">{product.description}</p>

          <dl className="grid grid-cols-2 gap-3 text-sm mb-8 p-4 rounded-xl bg-[var(--color-surface)]">
            <div>
              <dt className="text-[var(--color-muted)]">Fabric</dt>
              <dd className="font-medium">{product.fabric}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted)]">Color</dt>
              <dd className="font-medium">{product.color}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[var(--color-muted)] mb-1">Availability</dt>
              <dd className="font-medium text-green-700">
                {product.inStock ? "In Stock — confirm on WhatsApp" : "Out of Stock"}
              </dd>
            </div>
          </dl>

          {product.sizes.length > 1 && (
            <div className="mb-6">
              <Label className="mb-2 block text-sm font-medium">Size</Label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={size === s ? "brand" : "outline"}
                    size="sm"
                    className="min-w-12 rounded-full"
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <Label className="mb-2 block text-sm font-medium">Quantity</Label>
            <div className="inline-flex items-center rounded-full border border-border">
              <Button
                type="button"
                variant="ghost"
                className="rounded-l-full"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </Button>
              <span className="w-12 text-center text-sm">{quantity}</span>
              <Button
                type="button"
                variant="ghost"
                className="rounded-r-full"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="brand" size="pill" className="flex-1" onClick={handleAddToCart}>
              Add to Bag
            </Button>
            <Button
              variant="whatsapp"
              size="pill"
              className="flex-1"
              render={
                <a href={inquiryUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              <IconWhatsApp className="size-5" />
              Ask on WhatsApp
            </Button>
          </div>

          <p className="text-xs text-[var(--color-muted)] mt-4 leading-relaxed">
            Orders are placed via WhatsApp. We&apos;ll confirm availability, sizing & payment
            details before dispatch. Free shipping across India.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[var(--color-border)]">
          <h2 className="section-title mb-8">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--color-surface)]">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="25vw"
                  />
                </div>
                <p className="text-sm font-medium mt-2 line-clamp-1">{p.name}</p>
                <p className="text-sm text-[var(--color-primary)] font-semibold">
                  {formatPrice(p.price)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
