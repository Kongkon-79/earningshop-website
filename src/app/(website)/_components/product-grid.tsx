"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Baby, PackageOpen, RefreshCw, ShoppingCart, TriangleAlert } from "lucide-react";
import Image from "next/image";
import { useState, type ReactElement } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { StorefrontProduct, StorefrontProductPage } from "@/lib/product-catalog";
import { cn } from "@/lib/utils";
import { dialog, number, price, primary, secondary, useCart } from "./cart";

const layouts = {
  home: {
    grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
    sizes: "(min-width: 1280px) 292px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
    skeletons: ["flex", "hidden sm:flex", "hidden lg:flex", "hidden lg:flex"],
  },
  catalog: {
    grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5",
    sizes: "(min-width: 1440px) 330px, (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
    skeletons: ["flex", "hidden sm:flex", "hidden lg:flex", "hidden xl:flex"],
  },
};

type ProductGridVariant = keyof typeof layouts;
const card = "min-w-0 flex-col overflow-hidden rounded-2xl border border-teal-900/10 bg-white shadow-sm";

async function fetchProducts(page: number, signal: AbortSignal): Promise<StorefrontProductPage> {
  const response = await fetch(`/api/products?page=${page}`, { signal, cache: "no-store" });
  if (!response.ok) throw new Error("Could not load products");
  return response.json();
}

function ProductImage({ src, alt, sizes, className }: {
  src?: string;
  alt: string;
  sizes: string;
  className: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div role={alt ? "img" : undefined} aria-label={alt ? `${alt} — ছবি নেই` : undefined} className="absolute inset-0 grid place-items-center bg-gradient-to-br from-emerald-50 to-amber-50">
        <Baby aria-hidden="true" className="size-1/4 max-h-12 max-w-12 text-teal-800/40" />
      </div>
    );
  }

  return <Image src={src} alt={alt} fill sizes={sizes} unoptimized referrerPolicy="no-referrer" className={className} onError={() => setFailed(true)} />;
}

function ProductGallery({ name, images }: Pick<StorefrontProduct, "name" | "images">) {
  const [selected, setSelected] = useState(0);
  const currentImage = images[selected] ?? images[0];

  return (
    <div className="min-w-0">
      <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-teal-50">
        <ProductImage key={currentImage} src={currentImage} alt={name} sizes="(min-width: 640px) 460px, 90vw" className="object-contain" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`${number(index + 1)} নম্বর ছবি দেখুন`}
              aria-pressed={image === currentImage}
              className="relative size-14 overflow-hidden rounded-lg border border-slate-300 bg-teal-50 aria-pressed:border-teal-700 aria-pressed:ring-1 aria-pressed:ring-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              onClick={() => setSelected(index)}
            >
              <ProductImage src={image} alt="" sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductDetails({ item, children }: { item: StorefrontProduct; children: ReactElement }) {
  const { cart, addProduct } = useCart();
  const quantity = cart[item.id]?.quantity ?? 0;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent lang="bn" closeLabel="বিস্তারিত বন্ধ করুন" className={dialog}>
        <DialogTitle className="pr-6 leading-snug [overflow-wrap:anywhere]">{item.name}</DialogTitle>
        <DialogDescription className={item.description ? "whitespace-pre-line [overflow-wrap:anywhere]" : "sr-only"}>
          {item.description || "প্রোডাক্টের ছবি ও দাম দেখুন।"}
        </DialogDescription>
        <ProductGallery name={item.name} images={item.images} />
        <p className="text-base font-bold">{price(item.price)}</p>
        <button type="button" className={primary} onClick={() => addProduct(item)}>
          কার্টে যোগ করুন{quantity > 0 && ` (${number(quantity)})`}
        </button>
      </DialogContent>
    </Dialog>
  );
}

function ProductCard({ item, variant }: { item: StorefrontProduct; variant: ProductGridVariant }) {
  const { cart, addProduct } = useCart();
  const quantity = cart[item.id]?.quantity ?? 0;
  const Title = variant === "catalog" ? "h2" : "h3";

  return (
    <li className={`${card} flex`}>
      <div className="relative aspect-[3/2] overflow-hidden bg-gradient-to-br from-emerald-50 to-amber-50">
        <ProductImage
          key={item.images[0]}
          src={item.images[0]}
          alt={item.name}
          sizes={layouts[variant].sizes}
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {item.category && <p className="text-sm font-semibold text-teal-800 [overflow-wrap:anywhere]">{item.category}</p>}
        <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <Title className="min-w-0 text-lg font-bold leading-snug [overflow-wrap:anywhere]">{item.name}</Title>
          <span className="shrink-0 whitespace-nowrap font-bold tabular-nums text-teal-900">{price(item.price)}</span>
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <button
            type="button"
            aria-label={`${item.name} কার্টে যোগ করুন${quantity > 0 ? ` (${number(quantity)})` : ""}`}
            className={cn(primary, "grow-[2] gap-1.5 whitespace-nowrap px-1.5")}
            onClick={() => addProduct(item)}
          >
            <ShoppingCart aria-hidden="true" className="hidden size-3.5 shrink-0 min-[380px]:block sm:hidden" />
            <span>কার্টে যোগ করুন{quantity > 0 && ` (${quantity > 99 ? "৯৯+" : number(quantity)})`}</span>
          </button>
          <ProductDetails item={item}>
            <button type="button" className={cn(secondary, "grow whitespace-nowrap px-1.5")} aria-label={`${item.name} বিস্তারিত দেখুন`}>
              বিস্তারিত দেখুন
            </button>
          </ProductDetails>
        </div>
      </div>
    </li>
  );
}

function ProductSkeleton({ variant }: { variant: ProductGridVariant }) {
  const layout = layouts[variant];

  return (
    <>
      <p role="status" className="sr-only">প্রোডাক্ট লোড হচ্ছে।</p>
      <div aria-hidden="true" className={layout.grid}>
        {layout.skeletons.map((visibility, index) => (
          <div key={index} className={`${card} ${visibility}`}>
            <div className="aspect-[3/2] bg-teal-100/60 motion-safe:animate-pulse" />
            <div className="space-y-3 p-4 motion-safe:animate-pulse sm:p-5">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="h-5 w-1/2 rounded bg-slate-200" />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="h-11 rounded-xl bg-teal-100" />
                <div className="h-11 rounded-xl bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function CatalogMessage({ onRetry }: { onRetry?: () => void }) {
  const Icon = onRetry ? TriangleAlert : PackageOpen;

  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-teal-900/20 bg-slate-50/70 px-4 py-8 text-center">
      <div className={`mb-3 grid size-12 place-items-center rounded-xl ${onRetry ? "bg-amber-100 text-amber-800" : "bg-teal-100 text-teal-800"}`}>
        <Icon aria-hidden="true" className="size-6" />
      </div>
      <div role={onRetry ? "alert" : "status"}>
        <h3 className="text-lg font-bold">
          {onRetry ? "প্রোডাক্ট লোড করা যায়নি" : "কোনো প্রোডাক্ট পাওয়া যায়নি"}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {onRetry ? "ক্যাটালগ দেখতে আবার চেষ্টা করুন।" : "নতুন প্রোডাক্ট যোগ হলে এখানে দেখা যাবে।"}
        </p>
      </div>
      {onRetry && (
        <button type="button" className={`${secondary} mt-4`} onClick={onRetry}>
          <RefreshCw aria-hidden="true" className="size-4" />
          আবার চেষ্টা করুন
        </button>
      )}
    </div>
  );
}

export default function ProductGrid({ variant = "home" }: { variant?: ProductGridVariant }) {
  const {
    data, isPending, isError, isFetching, hasNextPage, isFetchingNextPage,
    isFetchNextPageError, fetchNextPage, refetch,
  } = useInfiniteQuery({
    queryKey: ["storefront-products"],
    queryFn: ({ pageParam, signal }) => fetchProducts(pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
    networkMode: "always",
  });
  const items = new Map<string, StorefrontProduct>();
  for (const page of data?.pages ?? []) {
    for (const item of page.products) items.set(item.id, item);
  }
  const products = Array.from(items.values());

  return (
    <section id="product-list" aria-label="প্রোডাক্ট তালিকা" className="scroll-mt-24">
      {isPending || (!data && isFetching) ? (
        <ProductSkeleton variant={variant} />
      ) : isError && !data ? (
        <CatalogMessage onRetry={() => void refetch()} />
      ) : products.length === 0 ? (
        <CatalogMessage />
      ) : (
        <ul role="list" className={layouts[variant].grid}>
          {products.map((item) => <ProductCard key={item.id} item={item} variant={variant} />)}
        </ul>
      )}
      {hasNextPage && (
        <div className="mt-6 text-center">
          {isFetchNextPageError && <p role="alert" className="mb-3 text-sm text-red-700">পরের প্রোডাক্টগুলো লোড করা যায়নি।</p>}
          <button type="button" className={`${secondary} disabled:opacity-60`} disabled={isFetching} onClick={() => void fetchNextPage()}>
            {isFetchingNextPage ? "লোড হচ্ছে…" : isFetchNextPageError ? "আবার চেষ্টা করুন" : "আরও প্রোডাক্ট দেখুন"}
          </button>
        </div>
      )}
    </section>
  );
}
