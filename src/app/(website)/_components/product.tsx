import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductGrid from "./product-grid";
import { Reveal } from "./website-motion";

export default function Product() {
  return (
    <section id="products" lang="bn" aria-labelledby="products-title" className="scroll-mt-24 bg-white font-sans text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12 lg:px-6 lg:py-16">
        <Reveal as="header" className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 lg:mb-8">
          <div>
            <p className="text-sm font-semibold text-teal-800">শপিং</p>
            <h2 id="products-title" className="mt-2 text-balance text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl">
              বেবি প্রোডাক্ট ক্যাটালগ
            </h2>
            <p className="mt-3 leading-relaxed text-slate-700">সীমিত ক্যাটালগ। পছন্দের প্রোডাক্টের দাম ও বিস্তারিত দেখুন।</p>
          </div>
          <Link href="/products" className="group inline-flex min-h-11 items-center gap-2 rounded-md font-semibold text-teal-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            সব প্রোডাক্ট দেখুন
            <ArrowRight aria-hidden="true" className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
        <ProductGrid />
      </div>
    </section>
  );
}
