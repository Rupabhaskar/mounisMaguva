"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "maguva-cart";

/** @typedef {{ productId: string; slug: string; sku: string; name: string; price: number; image: string; quantity: number; size: string; color?: string; imageIndex?: number }} CartItem */

/** @type {React.Context<{
 *   items: CartItem[];
 *   isOpen: boolean;
 *   itemCount: number;
 *   subtotal: number;
 *   openCart: () => void;
 *   closeCart: () => void;
 *   toggleCart: () => void;
 *   addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
 *   removeItem: (productId: string, size: string) => void;
 *   updateQuantity: (productId: string, size: string, quantity: number) => void;
 *   clearCart: () => void;
 * } | null>} */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(/** @type {CartItem[]} */ ([]));
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        startTransition(() => {
          setItems(JSON.parse(stored));
        });
      }
    } catch {
      /* ignore */
    }
    startTransition(() => {
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const addItem = useCallback(
    /** @param {Omit<CartItem, 'quantity'> & { quantity?: number }} */ (item) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === item.productId && i.size === item.size,
        );
        if (existing) {
          return prev.map((i) =>
            i.productId === item.productId && i.size === item.size
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i,
          );
        }
        return [...prev, { ...item, quantity: item.quantity || 1 }];
      });
      setIsOpen(true);
    },
    [],
  );

  const removeItem = useCallback((productId, size) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size)),
    );
  }, []);

  const updateQuantity = useCallback((productId, size, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size ? { ...i, quantity } : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      itemCount,
      subtotal,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      isOpen,
      itemCount,
      subtotal,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
