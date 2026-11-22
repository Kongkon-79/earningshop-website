"use client";

import { ShoppingCart } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatProductPrice, type CatalogProduct } from "@/lib/product-catalog";
import { cn } from "@/lib/utils";
import CartOrderForm from "./cart-order-form";

export const number = (value: number) => value.toLocaleString("bn-BD");
export const price = formatProductPrice;
const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700";
export const primary = `${button} bg-teal-900 text-white hover:bg-teal-800`;
export const secondary = `${button} border border-slate-300 bg-white text-slate-800 hover:bg-teal-50`;
export const dialog = "max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 font-sans text-slate-900";

type CartProduct = Pick<CatalogProduct, "id" | "name" | "price">;
type CartLine = CartProduct & { quantity: number };

type Cart = {
  cart: Record<string, CartLine>;
  changeQuantity: (id: string, change: number) => void;
  addProduct: (product: CartProduct) => void;
  addIfMissing: (product: CartProduct) => void;
};

const CartContext = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart["cart"]>({});

  function changeQuantity(id: string, change: number) {
    setCart((current) => {
      const line = current[id];
      if (!line) return current;

      const quantity = line.quantity + change;
      const next = { ...current };
      if (quantity > 0) {
        next[id] = { ...line, quantity };
      } else {
        delete next[id];
      }
      return next;
    });
  }

  function addProduct(product: CartProduct) {
    const { id, name, price } = product;
    setCart((current) => ({
      ...current,
      [id]: { id, name, price, quantity: (current[id]?.quantity ?? 0) + 1 },
    }));
  }

  function addIfMissing(product: CartProduct) {
    const { id, name, price } = product;
    setCart((current) => current[id] ? current : { ...current, [id]: { id, name, price, quantity: 1 } });
  }

  return <CartContext.Provider value={{ cart, changeQuantity, addProduct, addIfMissing }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart requires CartProvider");
  return cart;
}

function CartItems({ items, changeQuantity, reviewing }: {
  items: CartLine[];
  changeQuantity: Cart["changeQuantity"];
  reviewing: boolean;
}) {
  const quantityButton = cn(secondary, "size-11 shrink-0 px-0 disabled:cursor-not-allowed disabled:opacity-50");

  return (
    <ul className="divide-y divide-slate-200">
      {items.map((item) => (
        <li key={item.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold [overflow-wrap:anywhere]">{item.name}</p>
            <p className="text-sm text-slate-700">
              {reviewing ? `একক মূল্য ${price(item.price)}` : price(item.price * item.quantity)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" className={quantityButton} aria-label={`${item.name} একটি কমান`} disabled={reviewing && item.quantity === 1} onClick={() => changeQuantity(item.id, -1)}>−</button>
            <span aria-live="polite" className="min-w-4 text-center tabular-nums">{number(item.quantity)}</span>
            <button type="button" className={quantityButton} aria-label={`${item.name} একটি বাড়ান`} onClick={() => changeQuantity(item.id, 1)}>+</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CartButton({ product }: { product?: CartProduct }) {
  const { cart, changeQuantity, addIfMissing } = useCart();
  const [isOrdering, setIsOrdering] = useState(false);
  const orderTitle = useRef<HTMLHeadingElement>(null);
  const orderButton = useRef<HTMLButtonElement>(null);
  const restoreOrderButtonFocus = useRef(false);
  const cartItems = Object.values(cart);
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (isOrdering) {
      orderTitle.current?.focus({ preventScroll: true });
    } else if (restoreOrderButtonFocus.current) {
      restoreOrderButtonFocus.current = false;
      orderButton.current?.focus();
    }
  }, [isOrdering]);

  function backToCart() {
    restoreOrderButtonFocus.current = true;
    setIsOrdering(false);
  }

  const items = <CartItems items={cartItems} changeQuantity={changeQuantity} reviewing={isOrdering} />;
  const totalLine = (
    <p className="flex flex-wrap justify-between gap-x-3 border-t border-slate-200 pt-3 font-bold">
      <span>মোট</span>
      <span className="whitespace-nowrap text-teal-900">{price(total)}</span>
    </p>
  );

  return (
    <Dialog onOpenChange={(open) => { if (!open) setIsOrdering(false); }}>
      {!product && <span role="status" className="sr-only">কার্টে {number(count)}টি পণ্য আছে।</span>}
      <DialogTrigger asChild>
        {product ? (
          <button
            type="button"
            aria-label={`${product.name} অর্ডার করুন`}
            className={`${button} shrink-0 whitespace-nowrap bg-slate-900 text-white shadow-sm transition-colors hover:bg-teal-900 motion-reduce:transition-none`}
            onClick={() => addIfMissing(product)}
          >
            অর্ডার করুন
          </button>
        ) : (
          <button type="button" aria-label={`কার্ট দেখুন (${number(count)})`} className={`${secondary} shrink-0 whitespace-nowrap`}>
            <ShoppingCart aria-hidden="true" className="size-5 shrink-0" />
            <span className="hidden sm:inline">কার্ট দেখুন</span> ({number(count)})
          </button>
        )}
      </DialogTrigger>
      <DialogContent
        lang="bn"
        closeLabel={isOrdering ? "অর্ডার ফর্ম বন্ধ করুন" : "কার্ট বন্ধ করুন"}
        className={cn(dialog, isOrdering && "flex max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-xl flex-col gap-0 overflow-hidden bg-[#f8f7f2] p-0 sm:p-0")}
      >
        {isOrdering ? (
          <>
            <header className="shrink-0 border-b border-slate-200 bg-white px-4 pb-3 pt-4 pr-12 sm:px-6 sm:pr-12">
              <DialogTitle ref={orderTitle} tabIndex={-1} className="text-xl leading-snug focus:outline-none">অর্ডার করুন</DialogTitle>
              <DialogDescription className="mt-1 text-sm leading-relaxed text-slate-600">
                পণ্যের পরিমাণ যাচাই করে ডেলিভারি তথ্য দিন।
              </DialogDescription>
            </header>
            <CartOrderForm
              summary={
                <section aria-label="অর্ডারের সারাংশ" className="rounded-xl border border-slate-200 bg-white px-3 pb-3 sm:px-4">
                  {items}
                  {totalLine}
                </section>
              }
              total={total}
              onBack={backToCart}
            />
          </>
        ) : (
          <>
            <DialogTitle>আপনার কার্ট</DialogTitle>
            <DialogDescription>{product ? "অর্ডারের জন্য পণ্যের পরিমাণ ও মোট দাম দেখুন।" : "কার্টের প্রোডাক্ট ও পরিমাণ দেখুন।"}</DialogDescription>
            {count === 0 ? (
              <p className="text-slate-700">কার্ট খালি আছে।</p>
            ) : (
              <>
                {items}
                {totalLine}
                <button ref={orderButton} type="button" className={`${primary} w-full`} onClick={() => setIsOrdering(true)}>
                  অর্ডার করুন
                </button>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
