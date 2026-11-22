import type { Metadata } from "next";
import ProductsContainer from "./_components/products-container";

export const metadata: Metadata = {
  title: "বেবি প্রোডাক্ট ক্যাটালগ | Earning Shop Limited",
};

export default function ProductsPage() {
  return <ProductsContainer />;
}
