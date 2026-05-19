"use client";

import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";

export default function Providers({ children }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <FloatingWhatsApp />
    </CartProvider>
  );
}
