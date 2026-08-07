import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CamisetaProduct } from "./camisetas.types";

export type CartItem = {
  productId: string;
  name: string;
  unitPrice: number;
  currency: string;
  imageUrl: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  addItem: (product: CamisetaProduct) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CART_STORAGE_KEY = "camisetas-cart";
const CartContext = createContext<CartContextValue | null>(null);

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadInitialCart());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product: CamisetaProduct) {
    const unitPrice = product.salePrice ?? product.price;
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          unitPrice,
          currency: product.currency,
          imageUrl: product.imageUrl,
          quantity: 1
        }
      ];
    });
    setIsDrawerOpen(true);
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }

  function setQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  }

  function clear() {
    setItems([]);
  }

  const totalCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items]);

  const value: CartContextValue = {
    items,
    totalCount,
    totalPrice,
    addItem,
    removeItem,
    setQuantity,
    clear,
    isDrawerOpen,
    openDrawer: () => setIsDrawerOpen(true),
    closeDrawer: () => setIsDrawerOpen(false)
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider.");
  }
  return context;
}
