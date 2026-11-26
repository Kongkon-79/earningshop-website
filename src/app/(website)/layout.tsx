import type { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import { CartButton } from "./_components/cart";
import { WebsiteMotion } from "./_components/website-motion";

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <WebsiteMotion>
      <Navbar cartAction={<CartButton />} />
      {children}
      <Footer />
    </WebsiteMotion>
  );
}
