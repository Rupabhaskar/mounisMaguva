"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatDiscount, formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const discount = formatDiscount(product.originalPrice, product.price);
  const defaultSize = product.sizes[0];

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: defaultSize,
      quantity: 1,
    });
  }

  return (
    <Card className="group overflow-hidden border-0 bg-transparent py-0 shadow-none">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--color-surface)]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {product.isNew && (
            <Badge variant="gold" className="absolute top-3 left-3">
              New
            </Badge>
          )}
          {discount && (
            <Badge variant="sale" className="absolute top-3 right-3">
              -{discount}%
            </Badge>
          )}
          <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
            <Button
              type="button"
              variant="secondary"
              className="w-full bg-white/95 shadow-lg backdrop-blur hover:bg-[var(--color-primary)] hover:text-white"
              onClick={handleAddToCart}
            >
              Add to Bag
            </Button>
          </div>
        </div>
        <div className="px-0.5 pt-3">
          <p className="mb-1 text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
            {product.sku}
          </p>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-[var(--color-primary)]">
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
        </div>
      </Link>
    </Card>
  );
}
