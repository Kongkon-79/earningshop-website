"use client";

import { ArrowDown, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { dialog, number, price, primary, products, secondary, useCart } from "./cart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Product() {
  const { cart, changeQuantity } = useCart();

  return (
    <section id="products" lang="bn" aria-labelledby="products-title" className="scroll-mt-24 bg-white font-sans text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <p className="text-sm font-semibold text-teal-800">শপিং</p>
            <h2 id="products-title" className="mt-2 text-balance text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl">
              বেবি প্রোডাক্ট ক্যাটালগ
            </h2>
            <p className="mt-3 leading-relaxed text-slate-700">সীমিত ক্যাটালগ। পছন্দের প্রোডাক্টের দাম ও বিস্তারিত দেখুন।</p>
          </div>
          <a href="#product-list" className="inline-flex min-h-11 items-center gap-2 rounded-md font-semibold text-teal-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            সব প্রোডাক্ট দেখুন
            <ArrowDown aria-hidden="true" className="size-4" />
          </a>
        </div>

        <ul id="product-list" role="list" className="mt-6 grid scroll-mt-24 gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3">
          {products.map((item) => (
            <li key={item.id} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-teal-900/10 bg-white shadow-sm">
              <div className="relative aspect-[3/2] overflow-hidden bg-[#e5eade]">
                <Image src={`/assets/products/${item.id}.png`} alt={item.name} fill sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <p className="text-sm font-semibold text-teal-800">{item.category}</p>
                <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="text-lg font-bold leading-snug">{item.name}</h3>
                  <span className="shrink-0 whitespace-nowrap font-bold tabular-nums text-teal-900">{price(item.price)}</span>
                </div>
                <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                  <button type="button" aria-label={`${item.name} কার্টে যোগ করুন`} className={`${primary} min-w-0`} onClick={() => changeQuantity(item.id, 1)}>
                    <ShoppingCart aria-hidden="true" className="hidden size-4 shrink-0 min-[380px]:block sm:hidden xl:block" />
                    <span>কার্টে যোগ করুন{cart[item.id] > 0 && ` (${number(cart[item.id])})`}</span>
                  </button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button type="button" className={`${secondary} min-w-0`} aria-label={`${item.name} বিস্তারিত দেখুন`}>বিস্তারিত দেখুন</button>
                    </DialogTrigger>
                    <DialogContent lang="bn" className={dialog}>
                      <DialogTitle>{item.name}</DialogTitle>
                      <DialogDescription>{item.description}</DialogDescription>
                      <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-teal-50">
                        <Image src={`/assets/products/${item.id}.png`} alt={item.name} fill sizes="(min-width: 640px) 460px, 90vw" className="object-cover" />
                      </div>
                      <p className="text-base font-bold">{price(item.price)}</p>
                      <button type="button" className={primary} onClick={() => changeQuantity(item.id, 1)}>
                        কার্টে যোগ করুন{cart[item.id] > 0 && ` (${number(cart[item.id])})`}
                      </button>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
