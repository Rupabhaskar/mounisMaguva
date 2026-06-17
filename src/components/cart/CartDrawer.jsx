"use client";

import ProductImage from "@/components/product/ProductImage";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { copyProductImagesForWhatsApp } from "@/lib/whatsapp-images";
import { getWhatsAppOrderUrl, buildWhatsAppOrderMessage } from "@/lib/whatsapp";
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
    discount,
    total,
    appliedCoupon,
    setAppliedCoupon,
    clearCart,
  } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [couponDraft, setCouponDraft] = useState("");
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const couponInput = couponDraft || appliedCoupon?.code || "";

  const couponBelowMinimum =
    appliedCoupon?.minOrderAmount &&
    subtotal < Number(appliedCoupon.minOrderAmount);

  const whatsappItems = items.map((i) => ({
    name: i.name,
    slug: i.slug,
    sku: i.sku,
    price: i.price,
    quantity: i.quantity,
    size: i.size,
    image: i.image,
  }));

  const checkoutUrl =
    items.length > 0
      ? getWhatsAppOrderUrl(whatsappItems, {
          name,
          phone,
          note,
          couponCode: discount > 0 ? appliedCoupon?.code : undefined,
          discountAmount: discount > 0 ? discount : undefined,
        })
      : "#";

  async function applyCoupon(event) {
    event.preventDefault();
    if (!couponInput.trim()) return;

    setApplyingCoupon(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const data = await res.json();

      if (!data.valid) {
        setCouponError(data.error || "Could not apply coupon.");
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(data.coupon);
      setCouponError("");
    } catch {
      setCouponError("Could not validate coupon. Try again.");
    } finally {
      setApplyingCoupon(false);
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponDraft("");
    setCouponError("");
  }

  function handleWhatsAppOrderClick() {
    if (!items.length) return;
    void copyProductImagesForWhatsApp(items.map((item) => item.image));

    const messagePreview = buildWhatsAppOrderMessage(whatsappItems, {
      name,
      phone,
      note,
      couponCode: discount > 0 ? appliedCoupon?.code : undefined,
      discountAmount: discount > 0 ? discount : undefined,
    });

    void fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        note,
        items: whatsappItems,
        couponCode: discount > 0 ? appliedCoupon?.code : "",
        discountAmount: discount > 0 ? discount : null,
        total,
        whatsappMessagePreview: messagePreview,
      }),
    });
  }

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
                    <ProductImage
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
                <form onSubmit={applyCoupon} className="space-y-2">
                  <Label htmlFor="cart-coupon" className="text-sm font-medium">
                    Coupon code
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="cart-coupon"
                      placeholder="Enter code"
                      value={couponInput}
                      onChange={(e) =>
                        setCouponDraft(e.target.value.toUpperCase())
                      }
                      className="uppercase"
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      className="shrink-0"
                      disabled={applyingCoupon}
                    >
                      {applyingCoupon ? "…" : "Apply"}
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-600">{couponError}</p>
                  )}
                  {appliedCoupon && !couponError && (
                    <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                      <span>
                        <span className="font-semibold">{appliedCoupon.code}</span>{" "}
                        applied
                        {discount > 0 ? ` (−${formatPrice(discount)})` : ""}
                      </span>
                      <button
                        type="button"
                        className="font-medium underline"
                        onClick={removeCoupon}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {couponBelowMinimum && (
                    <p className="text-xs text-amber-700">
                      Add more items to use {appliedCoupon?.code} (min{" "}
                      {formatPrice(Number(appliedCoupon?.minOrderAmount))}).
                    </p>
                  )}
                </form>

                <div className="space-y-2">
                  <Input
                    id="cart-name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    id="cart-phone"
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input
                    id="cart-email"
                    type="email"
                    placeholder="Email (for order tracking)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
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

                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-700">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-2">
                    <span className="font-medium">Total</span>
                    <span className="font-[family-name:var(--font-display)] text-xl text-[var(--color-primary)]">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="whatsapp"
                  size="pill"
                  className="w-full"
                  render={
                    <a
                      href={checkoutUrl}
                      rel="noopener noreferrer"
                      onClick={handleWhatsAppOrderClick}
                    />
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
