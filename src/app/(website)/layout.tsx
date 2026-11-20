import type { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import { CartButton } from "./_components/cart";

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar cartAction={<CartButton />} />
      {children}
      <Footer />
    </>
  );
}
