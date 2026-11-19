"use client";

import { ShoppingCart } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const products = [
  { id: "diapers", name: "বেবি ডায়াপার", category: "ডায়াপার", price: 650, description: "শিশুর দৈনন্দিন ব্যবহারের জন্য ডিসপোজেবল ডায়াপার।" },
  { id: "feeding-bottle", name: "বেবি ফিডিং বোতল", category: "ফিডিং", price: 320, description: "দুধ খাওয়ানোর জন্য ঢাকনাসহ স্বচ্ছ ফিডিং বোতল।" },
  { id: "bodysuit", name: "বেবি বডি সেট", category: "পোশাক", price: 450, description: "শিশুর প্রতিদিনের ব্যবহারের জন্য কটন বডিস্যুট সেট।" },
];

export const number = (value: number) => value.toLocaleString("bn-BD");
export const price = (value: number) => `৳${number(value)}`;
const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700";
export const primary = `${button} bg-teal-900 text-white hover:bg-teal-800`;
export const secondary = `${button} border border-slate-300 bg-white text-slate-800 hover:bg-teal-50`;
export const dialog = "max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 font-sans text-slate-900";

type Cart = {
  cart: Record<string, number>;
  changeQuantity: (id: string, change: number) => void;
};

const CartContext = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart["cart"]>({});

  function changeQuantity(id: string, change: number) {
    setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + change) }));
  }

  return <CartContext.Provider value={{ cart, changeQuantity }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart requires CartProvider");
  return cart;
}

export function CartButton() {
  const { cart, changeQuantity } = useCart();
  const count = products.reduce((sum, item) => sum + (cart[item.id] ?? 0), 0);
  const total = products.reduce((sum, item) => sum + item.price * (cart[item.id] ?? 0), 0);

  return (
    <Dialog>
      <span role="status" className="sr-only">কার্টে {number(count)}টি পণ্য আছে।</span>
      <DialogTrigger asChild>
        <button type="button" aria-label={`কার্ট দেখুন (${number(count)})`} className={`${secondary} shrink-0 whitespace-nowrap`}>
          <ShoppingCart aria-hidden="true" className="size-5 shrink-0" />
          <span className="hidden sm:inline">কার্ট দেখুন</span> ({number(count)})
        </button>
      </DialogTrigger>
      <DialogContent lang="bn" className={dialog}>
        <DialogTitle>আপনার কার্ট</DialogTitle>
        <DialogDescription>কার্টের প্রোডাক্ট ও পরিমাণ দেখুন।</DialogDescription>
        {count === 0 ? (
          <p className="text-slate-700">কার্ট খালি আছে।</p>
        ) : (
          <>
            <ul className="divide-y divide-slate-200">
              {products.filter(({ id }) => cart[id] > 0).map((item) => (
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
