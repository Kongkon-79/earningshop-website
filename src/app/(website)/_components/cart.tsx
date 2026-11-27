"use client";

import { Check, ShoppingCart, Trash2 } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { maxCartLines, maxCartQuantity, type CheckoutReceipt } from "@/lib/checkout";
import { formatProductPrice, type StorefrontProduct } from "@/lib/product-catalog";
import { cn } from "@/lib/utils";
import CartOrderForm from "./cart-order-form";

export const number = (value: number) => value.toLocaleString("bn-BD");
export const price = formatProductPrice;
const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700";
export const primary = `${button} bg-teal-900 text-white hover:bg-teal-800`;
export const secondary = `${button} border border-slate-300 bg-white text-slate-800 hover:bg-teal-50`;
export const dialog = "max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 font-sans text-slate-900";

type CartProduct = Pick<StorefrontProduct, "id" | "name" | "price">;
type CartLine = CartProduct & { quantity: number };
type Cart = {
  cart: Record<string, CartLine>;
  changeQuantity: (id: string, change: number) => void;
  addProduct: (product: CartProduct) => void;
  removeProduct: (id: string) => void;
  removePurchased: (items: CartLine[]) => void;
};

const CartContext = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart["cart"]>({});

  function changeQuantity(id: string, change: number) {
    setCart((current) => {
      const line = current[id];
      if (!line) return current;

      const quantity = Math.min(line.quantity + change, maxCartQuantity);
      const next = { ...current };
      if (quantity > 0) {
        next[id] = { ...line, quantity };
      } else {
        delete next[id];
      }
      return next;
    });
  }

  function addProduct({ id, name, price }: CartProduct) {
    if ((!cart[id] && Object.keys(cart).length >= maxCartLines) || (cart[id]?.quantity ?? 0) >= maxCartQuantity) {
      toast.error("কার্টে প্রোডাক্টের সর্বোচ্চ পরিমাণ যোগ হয়েছে।");
      return;
    }
    setCart((current) => {
      const line = current[id];
      if (!line && Object.keys(current).length >= maxCartLines) return current;
      return {
        ...current,
        [id]: { id, name, price, quantity: Math.min((line?.quantity ?? 0) + 1, maxCartQuantity) },
      };
    });
  }

  function removeProduct(id: string) {
    setCart((current) => {
      if (!current[id]) return current;

      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function removePurchased(items: CartLine[]) {
    setCart((current) => {
      const next = { ...current };
      for (const { id, quantity } of items) {
        const line = next[id];
        if (!line) continue;
        if (line.quantity <= quantity) delete next[id];
        else next[id] = { ...line, quantity: line.quantity - quantity };
      }
      return next;
    });
  }

  return <CartContext.Provider value={{ cart, changeQuantity, addProduct, removeProduct, removePurchased }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart requires CartProvider");
  return cart;
}

function CartItems({ items, changeQuantity, onRemove, reviewing, busy }: {
  items: CartLine[];
  changeQuantity: Cart["changeQuantity"];
  onRemove: (id: string) => void;
  reviewing: boolean;
  busy: boolean;
}) {
  const quantityButton = cn(secondary, "size-11 shrink-0 px-0 disabled:cursor-not-allowed disabled:opacity-50");

  return (
    <ul className="divide-y divide-slate-200">
      {items.map((item) => (
        <li key={item.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
          <div className="min-w-0 flex-1 basis-28">
            <p className="font-semibold [overflow-wrap:anywhere]">{item.name}</p>
            <p className="text-sm text-slate-700">
              {reviewing ? "একক মূল্য " + price(item.price) : price(item.price * item.quantity)}
            </p>
          </div>
          <div className="ml-auto flex max-w-full shrink-0 flex-wrap items-center gap-1.5 sm:gap-2">
            <button type="button" className={quantityButton} aria-label={item.name + " একটি কমান"} disabled={busy || (reviewing && item.quantity === 1)} onClick={() => changeQuantity(item.id, -1)}>−</button>
            <span aria-live="polite" className="min-w-4 text-center tabular-nums">{number(item.quantity)}</span>
            <button type="button" className={quantityButton} aria-label={item.name + " একটি বাড়ান"} disabled={busy || item.quantity >= maxCartQuantity} onClick={() => changeQuantity(item.id, 1)}>+</button>
            <button
              type="button"
              data-cart-remove
              aria-label={item.name + " কার্ট থেকে সরান"}
              title="কার্ট থেকে সরান"
              disabled={busy}
              className={cn(button, "ml-1 size-11 shrink-0 border border-red-200 bg-white px-0 text-red-700 hover:bg-red-50 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-50")}
              onClick={() => onRemove(item.id)}
            >
              <Trash2 aria-hidden="true" className="size-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CartButton() {
  const { cart, changeQuantity, removeProduct, removePurchased } = useCart();
  const [open, setOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [receipt, setReceipt] = useState<CheckoutReceipt | null>(null);
  const [busy, setBusy] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const emptyCart = useRef<HTMLParagraphElement>(null);
  const removedIndex = useRef<number | null>(null);
  const orderTitle = useRef<HTMLHeadingElement>(null);
  const orderButton = useRef<HTMLButtonElement>(null);
  const restoreOrderButtonFocus = useRef(false);
  const cartItems = Object.values(cart);
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const countLabel = count > 99 ? "৯৯+" : number(count);

  useEffect(() => {
    if (isOrdering) {
      orderTitle.current?.focus({ preventScroll: true });
    } else if (restoreOrderButtonFocus.current) {
      restoreOrderButtonFocus.current = false;
      orderButton.current?.focus();
    }
  }, [isOrdering, receipt]);

  useEffect(() => {
    const index = removedIndex.current;
    if (index == null) return;

    removedIndex.current = null;
    const buttons = content.current?.querySelectorAll<HTMLButtonElement>("[data-cart-remove]");
    const nextButton = buttons?.[Math.min(index, buttons.length - 1)];
    (nextButton ?? emptyCart.current)?.focus({ preventScroll: true });
  }, [cartItems.length]);

  function changeOpen(next: boolean) {
    if (busy) return;
    setOpen(next);
    if (!next) {
      setIsOrdering(false);
      setReceipt(null);
    }
  }

  function backToCart() {
    restoreOrderButtonFocus.current = true;
    setIsOrdering(false);
  }

  function removeCartItem(id: string) {
    if (busy) return;
    removedIndex.current = cartItems.findIndex((item) => item.id === id);
    if (cartItems.length === 1) setIsOrdering(false);
    removeProduct(id);
  }

  function completeOrder(order: CheckoutReceipt) {
    removePurchased(cartItems);
    setReceipt(order);
  }

  const items = <CartItems items={cartItems} changeQuantity={changeQuantity} onRemove={removeCartItem} reviewing={isOrdering} busy={busy} />;
  const totalLine = (
    <p className="flex flex-wrap justify-between gap-x-3 border-t border-slate-200 pt-3 font-bold">
      <span>{isOrdering ? "পণ্যের মোট" : "মোট"}</span>
      <span className="whitespace-nowrap text-teal-900">{price(total)}</span>
    </p>
  );

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <span role="status" className="sr-only">কার্টে {number(count)}টি পণ্য আছে।</span>
      <DialogTrigger asChild>
        <button type="button" aria-label={"কার্ট দেখুন (" + number(count) + ")"} className={cn(secondary, "shrink-0 whitespace-nowrap")}>
          <ShoppingCart aria-hidden="true" className="size-5 shrink-0" />
          <span className="hidden sm:inline">কার্ট দেখুন</span> ({countLabel})
        </button>
      </DialogTrigger>
      <DialogContent
        ref={content}
        lang="bn"
        closeLabel={isOrdering ? "অর্ডার ফর্ম বন্ধ করুন" : "কার্ট বন্ধ করুন"}
        className={cn(
          dialog,
          isOrdering && !receipt && "flex max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-xl flex-col gap-0 overflow-hidden bg-[#f8f7f2] p-0 sm:p-0",
          busy && "[&>button]:hidden",
        )}
      >
        {receipt ? (
          <>
            <div className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Check aria-hidden="true" className="size-6" />
            </div>
            <DialogTitle ref={orderTitle} tabIndex={-1} className="focus:outline-none">অর্ডার জমা হয়েছে</DialogTitle>
            <DialogDescription>অর্ডারের ডেলিভারি ও পেমেন্ট যাচাইয়ের জন্য স্টোর আপনার সঙ্গে যোগাযোগ করবে।</DialogDescription>
            <dl className="grid gap-2 rounded-xl bg-teal-50 px-4 py-3 text-sm">
              <div className="flex flex-wrap justify-between gap-x-3">
                <dt>অর্ডার নম্বর</dt>
                <dd className="break-all font-semibold" dir="ltr">{receipt._id}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-x-3 font-semibold">
                <dt>অর্ডারের মোট</dt>
                <dd>{price(receipt.totalPrice)}</dd>
              </div>
            </dl>
            <DialogClose asChild><button type="button" className={primary}>বন্ধ করুন</button></DialogClose>
          </>
        ) : isOrdering ? (
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
              items={cartItems}
              total={total}
              onBack={backToCart}
              onBusyChange={setBusy}
              onCompleted={completeOrder}
            />
          </>
        ) : (
          <>
            <DialogTitle>আপনার কার্ট</DialogTitle>
            <DialogDescription>কার্টের প্রোডাক্ট ও পরিমাণ দেখুন।</DialogDescription>
            {count === 0 ? (
              <p ref={emptyCart} tabIndex={-1} className="rounded-sm text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700">কার্ট খালি আছে।</p>
            ) : (
              <>
                {items}
                {totalLine}
                <button ref={orderButton} type="button" className={cn(primary, "w-full")} onClick={() => setIsOrdering(true)}>
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
