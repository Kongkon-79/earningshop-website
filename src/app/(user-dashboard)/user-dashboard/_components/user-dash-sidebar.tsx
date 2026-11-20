"use client";

import { House, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { dashboardLinks, settingsHref } from "./dashboard-links";

const itemClass = "flex min-h-11 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium leading-snug";

export default function UserDashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function logout() {
    setIsSigningOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch {
      toast.error("লগআউট করা যায়নি। আবার চেষ্টা করুন।");
      setIsSigningOut(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col gap-4 p-3 sm:gap-5 sm:p-4 lg:gap-6">
      <Link href="/" onClick={onNavigate} className="inline-flex w-fit rounded-lg px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
        <Image src="/assets/images/logo.png" alt="Earningshop Limited" width={715} height={349} sizes="(min-width: 1280px) 144px, 128px" className="h-auto w-32 xl:w-36" priority={!onNavigate} />
      </Link>

      <nav aria-label="ড্যাশবোর্ড ন্যাভিগেশন" className="space-y-1">
        {dashboardLinks.map(({ href, label, icon: Icon }) => {
          const current = pathname === href;
          const inSection = href === settingsHref && pathname.startsWith(`${settingsHref}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={current ? "page" : inSection ? "location" : undefined}
              onClick={onNavigate}
              className={cn(
                itemClass,
                "border border-transparent focus-visible:outline-teal-700",
                current || inSection
                  ? "border-emerald-800 bg-emerald-800 font-semibold text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-50 hover:text-teal-900",
              )}
            >
              <Icon aria-hidden="true" className="size-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-slate-200 pt-3">
        <Link href="/" onClick={onNavigate} className={cn(itemClass, "text-slate-700 hover:bg-slate-50 focus-visible:outline-teal-700")}>
          <House aria-hidden="true" className="size-4 shrink-0" />
          স্টোরে ফিরুন
        </Link>
        <button type="button" disabled={isSigningOut} onClick={logout} className={cn(itemClass, "w-full text-slate-700 hover:bg-red-50 hover:text-red-800 focus-visible:outline-teal-700 disabled:opacity-60")}>
          <LogOut aria-hidden="true" className="size-4 shrink-0" />
          {isSigningOut ? "লগআউট হচ্ছে…" : "লগআউট"}
        </button>
      </div>
    </div>
  );
}
