"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";
import { IconMinus, IconPlus, IconWhatsApp } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    clearCart,
  } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const whatsappItems = items.map((i) => ({
    name: i.name,
    sku: i.sku,
    price: i.price,
    quantity: i.quantity,
    size: i.size,
  }));

  const checkoutUrl =
    items.length > 0
      ? getWhatsAppOrderUrl(whatsappItems, { name, phone, note })
      : "#";

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeCart();
      }}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-[var(--color-border)] bg-[var(--color-cream)] p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-[var(--color-border)] px-5 py-4 text-left">
          <SheetTitle className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-primary)]">
            Your Bag
          </SheetTitle>
          <SheetDescription className="sr-only">
            Review items and order on WhatsApp
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="mb-6 text-muted-foreground">Your bag is empty</p>
            <Button variant="brand" size="pill" render={<Link href="/shop" onClick={closeCart} />}>
              Explore Collection
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-3 pb-4"
                >
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface)]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.sku} · {item.size}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--color-primary)]">
                      {formatPrice(item.price)}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-border">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-l-full"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.quantity - 1,
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          <IconMinus />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-r-full"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.quantity + 1,
                            )
                          }
                          aria-label="Increase quantity"
                        >
                          <IconPlus />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-xs text-muted-foreground"
                        onClick={() => removeItem(item.productId, item.size)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <SheetFooter className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/50 px-5 py-4">
              <div className="w-full space-y-4">
                <p className="text-sm text-muted-foreground">
                  Share your details — we&apos;ll confirm availability on WhatsApp
                </p>
                <div className="space-y-2">
                  <Label htmlFor="cart-name" className="sr-only">
                    Your name
                  </Label>
                  <Input
                    id="cart-name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Label htmlFor="cart-phone" className="sr-only">
                    Phone number
                  </Label>
                  <Input
                    id="cart-phone"
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Label htmlFor="cart-note" className="sr-only">
                    Special requests
                  </Label>
                  <Textarea
                    id="cart-note"
                    placeholder="Special requests (size, color, delivery...)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-[family-name:var(--font-display)] text-xl text-[var(--color-primary)]">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <Button
                  variant="whatsapp"
                  size="pill"
                  className="w-full"
                  render={
                    <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" />
                  }
                >
                  <IconWhatsApp className="size-5" />
                  Order on WhatsApp
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-xs text-muted-foreground"
                  onClick={clearCart}
                >
                  Clear bag
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

