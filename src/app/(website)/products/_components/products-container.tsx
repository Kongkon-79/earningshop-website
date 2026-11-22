import ProductGrid from "../../_components/product-grid";

export default function ProductsContainer() {
  return (
    <main id="main-content" lang="bn" tabIndex={-1} className="scroll-mt-24 bg-[#f8f7f2] font-sans text-slate-900 focus:outline-none">
      <div className="mx-auto max-w-[90rem] px-4 pb-12 pt-7 sm:px-6 sm:pb-16 sm:pt-9 lg:px-8">
        <header className="mb-7 sm:mb-9">
          <p className="text-sm font-semibold text-teal-800">শপিং</p>
          <h1 className="mt-2 text-balance text-3xl font-bold leading-snug sm:text-4xl lg:text-[2.75rem]">
            বেবি প্রোডাক্ট ক্যাটালগ
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate-700">
            পছন্দের বেবি প্রোডাক্টের দাম ও বিস্তারিত দেখুন, তারপর কার্টে যোগ করুন।
          </p>
        </header>
        <ProductGrid variant="catalog" />
      </div>
    </main>
  );
}
