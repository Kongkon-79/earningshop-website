"use client";

import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CartButton } from "@/app/(website)/_components/cart";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { settingsLinks } from "../settings/settings-links";
import { dashboardLinks } from "./dashboard-links";
import AccountMenu from "./account-menu";
import UserDashboardSidebar from "./user-dash-sidebar";

const desktopQuery = "(min-width: 1024px)";

type UserDashboardHeaderProps = {
  fullName: string;
  profileAvatar: ReactNode;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

const menuButtonClass = "size-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-teal-900 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700";

export default function UserDashboardHeader({ fullName, profileAvatar, sidebarCollapsed, onToggleSidebar }: UserDashboardHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!open) return;

    const desktop = window.matchMedia(desktopQuery);
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };

    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [open]);

  const dashboardLink = dashboardLinks.find(({ href }) => href === pathname);
  const pageHeading = settingsLinks.find(({ href }) => href === pathname) ?? dashboardLink;
  const description = pageHeading?.description;
  const title = dashboardLink?.title ?? pageHeading?.label ?? "ইউজার ড্যাশবোর্ড";
  const toggleLabel = sidebarCollapsed ? "সাইডবার বড় করুন" : "সাইডবার ছোট করুন";
  const SidebarIcon = sidebarCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-[var(--dashboard-gutter)] backdrop-blur-sm [@media(max-height:480px)_and_(max-width:1023px)]:static">
      <div className="grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 py-2 sm:gap-x-3 sm:py-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="ড্যাশবোর্ড মেনু খুলুন"
              className={`grid lg:hidden ${menuButtonClass}`}
            >
              <Menu aria-hidden="true" className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            aria-describedby={undefined}
            lang="bn"
            closeLabel="ড্যাশবোর্ড মেনু বন্ধ করুন"
            onCloseAutoFocus={(event) => {
              if (!window.matchMedia(desktopQuery).matches) return;
              event.preventDefault();
              titleRef.current?.focus();
            }}
            className="h-dvh w-[min(88vw,20rem)] overflow-hidden bg-white p-0 font-sans text-slate-900 motion-reduce:animate-none"
          >
            <SheetTitle className="sr-only">ড্যাশবোর্ড মেনু</SheetTitle>
            <UserDashboardSidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <button
          type="button"
          aria-label={toggleLabel}
          aria-expanded={!sidebarCollapsed}
          aria-controls="desktop-dashboard-sidebar"
          title={toggleLabel}
          className={`hidden lg:grid ${menuButtonClass}`}
          onClick={onToggleSidebar}
        >
          <SidebarIcon aria-hidden="true" className="size-5" />
        </button>

        <h1 ref={titleRef} tabIndex={-1} className="min-w-0 break-words rounded-sm text-lg font-bold leading-snug text-slate-900 focus-visible:outline-teal-700 sm:text-xl lg:text-2xl">{title}</h1>
        <div className={cn("col-start-3 row-start-1 flex min-w-0 items-center gap-2 justify-self-end sm:gap-3", description && "row-end-3")}>
          <CartButton />
          <AccountMenu fullName={fullName} profileAvatar={profileAvatar} />
        </div>

        {description && (
          <p className="col-span-2 row-start-2 text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere] lg:col-span-1 lg:col-start-2">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
