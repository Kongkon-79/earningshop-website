import ProductGrid from "@/app/(website)/_components/product-grid";

export default function ProductsContainer() {
  return (
    <div className="pt-[var(--dashboard-gutter)]">
      <ProductGrid variant="catalog" />
    </div>
  );
}
