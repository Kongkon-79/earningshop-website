import type { ReactNode } from "react";
import { WebsiteMotion } from "@/app/(website)/_components/website-motion";
import AuthPageShell from "./auth-page-shell";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <WebsiteMotion>
      <AuthPageShell>{children}</AuthPageShell>
    </WebsiteMotion>
  );
}
