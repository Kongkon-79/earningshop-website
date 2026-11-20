import { Baby } from "lucide-react";
import { CartButton } from "@/app/(website)/_components/cart";
import { dashboardProducts, formatProductPrice } from "@/lib/product-catalog";

export default function ProductsContainer() {
  return (
    <section aria-label="বেবি প্রোডাক্ট ক্যাটালগ" className="pt-[var(--dashboard-gutter)]">
      <ul className="grid gap-4 sm:grid-cols-2 lg:gap-[var(--dashboard-gutter)] xl:grid-cols-3">
        {dashboardProducts.map((product) => (
          <li
            key={product.id}
            className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div aria-hidden="true" className="grid aspect-[13/6] place-items-center bg-gradient-to-br from-emerald-50 via-[#f4faef] to-[#fcf9e9]">
              <Baby className="size-10 text-emerald-700/35 sm:size-11" strokeWidth={2.15} />
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <p lang="en" className="text-[0.6875rem] font-semibold uppercase tracking-wider text-emerald-800">
                Baby Products
              </p>
              <h2 className="mt-1 text-base font-bold leading-snug text-slate-900 [overflow-wrap:anywhere]">
                {product.name}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                {product.summary}
              </p>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-4">
                <p className="whitespace-nowrap text-sm font-bold tabular-nums text-slate-900">
                  {formatProductPrice(product.price)}
                </p>
                <CartButton product={product} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
