"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatDiscount, formatPrice } from "@/lib/format";
import { getProductThumbnail } from "@/lib/product-images";
import { Badge } from "@/components/ui/badge";
import HotBadge from "@/components/product/HotBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const discount = formatDiscount(product.originalPrice, product.price);
  const defaultSize = product.sizes[0];
  const thumbnail = getProductThumbnail(product);

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: thumbnail,
      size: defaultSize,
      quantity: 1,
    });
  }

  return (
    <Card className="group/card overflow-hidden border-0 bg-transparent py-0 shadow-none">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--color-surface)]">
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-x-0 top-0 bottom-14 z-0 sm:inset-0"
          aria-label={`View ${product.name}`}
        >
          <Image
            src={thumbnail}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
        <div className="pointer-events-none absolute top-3 left-3 z-[1] flex flex-col gap-1.5">
          {product.isBestSeller && <HotBadge />}
          {product.isNew && (
            <Badge variant="gold">New</Badge>
          )}
        </div>
        {discount && (
          <Badge variant="sale" className="pointer-events-none absolute top-3 right-3 z-[1]">
            -{discount}%
          </Badge>
        )}
        <div className="absolute inset-x-0 bottom-0 z-20 p-3 sm:pointer-events-none sm:translate-y-full sm:transition-transform sm:duration-300 sm:group-hover/card:translate-y-0">
          <Button
            type="button"
            variant="secondary"
            className="pointer-events-auto w-full touch-manipulation bg-white/95 shadow-lg backdrop-blur hover:bg-[var(--color-primary)] hover:text-white"
            onClick={handleAddToCart}
          >
            Add to Bag
          </Button>
        </div>
      </div>
      <Link href={`/product/${product.slug}`} className="block px-0.5 pt-3">
        <p className="mb-1 text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
          {product.sku}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover/card:text-[var(--color-primary)]">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-semibold text-[var(--color-primary)]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[var(--color-muted)] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </Link>
    </Card>
  );
}
