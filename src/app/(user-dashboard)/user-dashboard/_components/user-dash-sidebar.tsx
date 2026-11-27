"use client";

import { House, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutModal from "@/components/modals/LogoutModal";
import { cn } from "@/lib/utils";

import { dashboardLinks, settingsHref } from "./dashboard-links";

const itemClass = "flex min-h-11 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium leading-snug";

export default function UserDashboardSidebar({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const linkClass = cn(itemClass, collapsed && "justify-center px-0");
  const labelClass = collapsed ? "sr-only" : undefined;

  return (
    <div className={cn(
      "flex h-full min-h-0 flex-col pb-3 pt-2 sm:pb-4 [@media(max-height:400px)]:pb-2",
      collapsed ? "px-2" : "px-3 sm:px-4",
    )}>
      <Link
        href="/"
        onClick={onNavigate}
        title={collapsed ? "Earningshop Limited" : undefined}
        className={cn(
          "inline-flex min-h-11 shrink-0 items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700",
          collapsed ? "w-11 justify-center self-center" : "w-fit px-2",
        )}
      >
        <Image
          src="/assets/images/logo.png"
          alt="Earningshop Limited"
          width={715}
          height={349}
          sizes={collapsed ? "44px" : "(max-height: 400px) 96px, (min-width: 1280px) 144px, 128px"}
          className={cn(
            "aspect-[5/2] h-auto object-cover",
            collapsed ? "w-11" : "w-32 xl:w-36 [@media(max-height:400px)]:w-24",
          )}
          priority={!onNavigate}
        />
      </Link>

      <nav aria-label="ড্যাশবোর্ড ন্যাভিগেশন" className="-mx-1 mt-1 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-y-contain px-1 py-1 lg:mt-2 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
        {dashboardLinks.map(({ href, label, icon: Icon }) => {
          const current = pathname === href;
          const inSection = href === settingsHref && pathname.startsWith(`${settingsHref}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={current ? "page" : inSection ? "location" : undefined}
              title={collapsed ? label : undefined}
              onClick={onNavigate}
              className={cn(
                linkClass,
                "border border-transparent focus-visible:outline-teal-700",
                current || inSection
                  ? "border-emerald-800 bg-emerald-800 font-semibold text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-50 hover:text-teal-900",
              )}
            >
              <Icon aria-hidden="true" className="size-5 shrink-0" />
              <span className={labelClass}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-3 shrink-0 space-y-1 border-t border-slate-200 pt-3 lg:mt-5 [@media(max-height:400px)]:mt-2 [@media(max-height:400px)]:pt-2">
        <Link href="/" onClick={onNavigate} title={collapsed ? "স্টোরে ফিরুন" : undefined} className={cn(linkClass, "text-slate-700 hover:bg-slate-50 focus-visible:outline-teal-700")}>
          <House aria-hidden="true" className="size-4 shrink-0" />
          <span className={labelClass}>স্টোরে ফিরুন</span>
        </Link>
        <LogoutModal>
          <button type="button" title={collapsed ? "লগআউট" : undefined} className={cn(linkClass, "w-full text-slate-700 hover:bg-red-50 hover:text-red-800 focus-visible:outline-teal-700")}>
            <LogOut aria-hidden="true" className="size-4 shrink-0" />
            <span className={labelClass}>লগআউট</span>
          </button>
        </LogoutModal>
      </div>
    </div>
  );
}
