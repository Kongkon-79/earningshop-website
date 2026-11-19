import type { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import { CartButton, CartProvider } from "./_components/cart";

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <Navbar cartAction={<CartButton />} />
      {children}
      <Footer />
    </CartProvider>
  );
}
