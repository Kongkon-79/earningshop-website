"use client";

import { ShoppingCart } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { dashboardProducts, formatProductPrice, type CatalogProduct } from "@/lib/product-catalog";

export { storefrontProducts as products } from "@/lib/product-catalog";

export const number = (value: number) => value.toLocaleString("bn-BD");
export const price = formatProductPrice;
const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700";
export const primary = `${button} bg-teal-900 text-white hover:bg-teal-800`;
export const secondary = `${button} border border-slate-300 bg-white text-slate-800 hover:bg-teal-50`;
export const dialog = "max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 font-sans text-slate-900";

type Cart = {
  cart: Record<string, number>;
  changeQuantity: (id: string, change: number) => void;
  addIfMissing: (id: string) => void;
};

const CartContext = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart["cart"]>({});

  function changeQuantity(id: string, change: number) {
    setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + change) }));
  }

  function addIfMissing(id: string) {
    setCart((current) => current[id] > 0 ? current : { ...current, [id]: 1 });
  }

  return <CartContext.Provider value={{ cart, changeQuantity, addIfMissing }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart requires CartProvider");
  return cart;
}

export function CartButton({ product }: { product?: Pick<CatalogProduct, "id" | "name"> }) {
  const { cart, changeQuantity, addIfMissing } = useCart();
  const cartItems = dashboardProducts.filter(({ id }) => cart[id] > 0);
  const count = cartItems.reduce((sum, item) => sum + cart[item.id], 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * cart[item.id], 0);

  return (
    <Dialog>
      {!product && <span role="status" className="sr-only">কার্টে {number(count)}টি পণ্য আছে।</span>}
      <DialogTrigger asChild>
        {product ? (
          <button
            type="button"
            aria-label={`${product.name} অর্ডার করুন`}
            className={`${button} shrink-0 whitespace-nowrap bg-slate-900 text-white shadow-sm transition-colors hover:bg-teal-900 motion-reduce:transition-none`}
            onClick={() => addIfMissing(product.id)}
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
      <DialogContent lang="bn" closeLabel="কার্ট বন্ধ করুন" className={dialog}>
        <DialogTitle>আপনার কার্ট</DialogTitle>
        <DialogDescription>{product ? "অর্ডারের জন্য পণ্যের পরিমাণ ও মোট দাম দেখুন।" : "কার্টের প্রোডাক্ট ও পরিমাণ দেখুন।"}</DialogDescription>
        {count === 0 ? (
          <p className="text-slate-700">কার্ট খালি আছে।</p>
        ) : (
          <>
            <ul className="divide-y divide-slate-200">
              {cartItems.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-slate-700">{price(item.price * cart[item.id])}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className={secondary} aria-label={`${item.name} একটি কমান`} onClick={() => changeQuantity(item.id, -1)}>−</button>
                    <span>{number(cart[item.id])}</span>
                    <button type="button" className={secondary} aria-label={`${item.name} একটি বাড়ান`} onClick={() => changeQuantity(item.id, 1)}>+</button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="flex justify-between border-t border-slate-200 pt-3 font-bold"><span>মোট</span><span>{price(total)}</span></p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
