"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  CreditCard,
  Heart,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatDiscount, formatPrice } from "@/lib/format";
import {
  getColorOptions,
  getProductBullets,
} from "@/lib/product-details";
import { getWhatsAppInquiryUrl, getWhatsAppOrderUrl } from "@/lib/whatsapp";
import { Badge } from "@/components/ui/badge";
import HotBadge from "@/components/product/HotBadge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfoCards from "@/components/product/ProductInfoCards";
import { getImagesForColor, getProductThumbnail } from "@/lib/product-images";
import { cn } from "@/lib/utils";

const WISHLIST_KEY = "maguva-wishlist";

export default function ProductDetail({ product, related = [] }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [size, setSize] = useState(product.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const colorOptions = useMemo(() => getColorOptions(product), [product]);
  const [selectedColorId, setSelectedColorId] = useState(
    colorOptions.find((c) => c.available)?.id ?? colorOptions[0]?.id,
  );
  const [wishlisted, setWishlisted] = useState(false);

  const selectedColor =
    colorOptions.find((c) => c.id === selectedColorId) ?? colorOptions[0];

  const galleryImages = useMemo(
    () => getImagesForColor(product, selectedColor?.label),
    [product, selectedColor?.label],
  );

  const sizesForSelectedColor = useMemo(() => {
    const label = selectedColor?.label;
    const override = label && product?.colorSizes?.[label];
    if (Array.isArray(override) && override.length) return override;
    return Array.isArray(product?.sizes) ? product.sizes : [];
  }, [product, selectedColor?.label]);

  useEffect(() => {
    startTransition(() => {
      setSelectedImage(0);
      setSize((prev) =>
        sizesForSelectedColor.includes(prev)
          ? prev
          : sizesForSelectedColor[0] || "",
      );
    });
  }, [selectedColorId, sizesForSelectedColor]);

  const discount = formatDiscount(product.originalPrice, product.price);
  const bullets = getProductBullets(product, colorOptions.length);
  const inquiryUrl = getWhatsAppInquiryUrl(product.name, product.sku);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      const list = raw ? JSON.parse(raw) : [];
      startTransition(() => {
        setWishlisted(Array.isArray(list) && list.includes(product.id));
      });
    } catch {
      startTransition(() => setWishlisted(false));
    }
  }, [product.id]);

  function buildCartPayload() {
    const colorLabel = selectedColor?.label ?? product.color;
    return {
      productId: product.id,
      slug: product.slug,
      sku: product.sku,
      name: `${product.name} (${colorLabel})`,
      price: product.price,
      image: galleryImages[0] || getProductThumbnail(product),
      size,
      quantity,
    };
  }

  function handleAddToCart() {
    if (!product.inStock || !selectedColor?.available) return;
    addItem(buildCartPayload());
  }

  function handleBuyNow() {
    if (!product.inStock || !selectedColor?.available) return;
    const item = buildCartPayload();
    addItem(item);
    const url = getWhatsAppOrderUrl([item], {
      note: `Buy now — Color: ${selectedColor.label}`,
    });
    window.open(url, "_blank");
  }

  function toggleWishlist() {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      let list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];
      if (list.includes(product.id)) {
        list = list.filter((id) => id !== product.id);
        setWishlisted(false);
      } else {
        list.push(product.id);
        setWishlisted(true);
      }
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  }

  const canPurchase = product.inStock && selectedColor?.available;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-[var(--color-muted)]">
        <Link href="/" className="hover:text-[var(--color-primary)]">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/shop" className="hover:text-[var(--color-primary)]">
          Shop
        </Link>
        <ChevronRight className="size-3" />
        <Link
          href={`/shop/${product.category}`}
          className="hover:text-[var(--color-primary)] capitalize"
        >
          {product.category}
        </Link>
        <ChevronRight className="size-3" />
        <span className="line-clamp-1 text-[var(--color-text)]">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ProductImageGallery
          images={galleryImages.length ? galleryImages : [getProductThumbnail(product)]}
          alt={product.name}
          isNew={product.isNew}
          isBestSeller={product.isBestSeller}
          discount={discount}
          selectedIndex={selectedImage}
          onSelectIndex={setSelectedImage}
        />

        <div className="flex flex-col">
          <p className="text-sm font-medium tracking-wide text-[var(--color-muted)]">
            {product.sku}
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl leading-tight text-[var(--color-text)] sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-[var(--color-muted)] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discount && (
              <Badge variant="sale">-{discount}%</Badge>
            )}
            {product.isBestSeller && <HotBadge />}
            {product.isNew && (
              <Badge variant="gold">New</Badge>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {product.inStock ? (
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                Out of Stock
              </span>
            )}
            {canPurchase && (
              <span className="text-sm text-emerald-700">Ready to add to cart!</span>
            )}
          </div>

          <ul className="mt-6 space-y-3 text-sm text-slate-700">
            {bullets.map((item) => (
              <li key={item.label}>
                <span className="font-semibold text-[var(--color-text)]">
                  {item.label}:{" "}
                </span>
                <span className="text-slate-600">{item.value}</span>
              </li>
            ))}
          </ul>

          {colorOptions.length > 0 && (
            <div className="mt-8">
              <Label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
                Color
              </Label>
              {selectedColor && (
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-sm">
                  <span
                    className="size-5 rounded-full border border-black/10"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span className="font-medium">{selectedColor.label}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((opt) => {
                  const isSelected = selectedColorId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={!opt.available}
                      onClick={() => setSelectedColorId(opt.id)}
                      className={cn(
                        "relative flex size-11 items-center justify-center rounded-full border-2 bg-slate-100 text-[10px] font-bold uppercase tracking-wide transition-all",
                        isSelected
                          ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/25"
                          : "border-slate-200 hover:border-[var(--color-primary)]/50",
                        !opt.available && "cursor-not-allowed opacity-50",
                      )}
                      title={opt.label}
                      aria-label={opt.label}
                      aria-pressed={isSelected}
                    >
                      {opt.abbr}
                      {!opt.available && (
                        <span
                          className="pointer-events-none absolute inset-0 flex items-center justify-center"
                          aria-hidden
                        >
                          <span className="h-0.5 w-full rotate-45 bg-red-500" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
              Size
            </Label>
            <div className="flex flex-wrap gap-2">
              {sizesForSelectedColor.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={cn(
                    "min-w-[5.5rem] rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-colors",
                    size === s
                      ? "border-[var(--color-primary)] bg-white text-[var(--color-primary)]"
                      : "border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-primary)]/40",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
              Quantity
            </Label>
            <div className="inline-flex items-center rounded-lg border border-[var(--color-border)] bg-white">
              <Button
                type="button"
                variant="ghost"
                className="rounded-l-lg"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </Button>
              <span className="w-12 text-center text-sm font-medium">{quantity}</span>
              <Button
                type="button"
                variant="ghost"
                className="rounded-r-lg"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Button
              variant="brand"
              size="block"
              className="rounded-lg"
              disabled={!canPurchase}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="size-5" />
              Add to Cart
            </Button>
            <Button
              variant="buyNow"
              size="block"
              disabled={!canPurchase}
              onClick={handleBuyNow}
            >
              <CreditCard className="size-5" />
              Buy Now Through WhatsApp
            </Button>
            <Button
              variant="brandOutline"
              size="block"
              className="rounded-lg bg-white"
              onClick={toggleWishlist}
            >
              <Heart
                className={cn("size-5", wishlisted && "fill-[var(--color-primary)]")}
              />
              {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-[var(--color-muted)]"
              render={
                <a href={inquiryUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              Questions? Chat on WhatsApp
            </Button>
          </div>

          <ProductInfoCards />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-[var(--color-border)] pt-12">
          <h2 className="section-title mb-8">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {related.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--color-surface)]">
                  <Image
                    src={getProductThumbnail(p)}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="25vw"
                  />
                </div>
                <p className="mt-2 line-clamp-1 text-sm font-medium">{p.name}</p>
                <p className="text-sm font-semibold text-[var(--color-primary)]">
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
