"use client";

import { CircleUserRound, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { settingsLinks } from "../settings/settings-links";
import { dashboardLinks } from "./dashboard-links";
import UserDashboardSidebar from "./user-dash-sidebar";

const desktopQuery = "(min-width: 1024px)";

export default function UserDashboardHeader({ fullName }: { fullName: string }) {
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
  const title = dashboardLink?.title ?? pageHeading?.label ?? "ইউজার ড্যাশবোর্ড";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-[var(--dashboard-gutter)] backdrop-blur-sm [@media(max-height:480px)_and_(max-width:1023px)]:static">
      <div className="grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 py-2 sm:gap-x-3 sm:py-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="ড্যাশবোর্ড মেনু খুলুন"
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-teal-900 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 lg:hidden"
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
            className="h-dvh w-[min(88vw,20rem)] overflow-y-auto overscroll-contain bg-white p-0 font-sans text-slate-900 motion-reduce:animate-none"
          >
            <SheetTitle className="sr-only">ড্যাশবোর্ড মেনু</SheetTitle>
            <UserDashboardSidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <h1 ref={titleRef} tabIndex={-1} className="min-w-0 break-words rounded-sm text-lg font-bold leading-snug text-slate-900 focus-visible:outline-teal-700 sm:text-xl lg:text-2xl">{title}</h1>
        <div className="flex min-w-0 max-w-9 items-center sm:max-w-40 md:max-w-56 gap-2 justify-self-end text-slate-700">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-900">
            <CircleUserRound aria-hidden="true" className="size-5" />
          </span>
          <span title={fullName} className="sr-only text-sm font-semibold sm:not-sr-only sm:truncate">{fullName}</span>
        </div>

        {pageHeading?.description && (
          <p className="col-span-full text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere] lg:col-span-1">
            {pageHeading.description}
          </p>
        )}
      </div>
    </header>
  );
}
