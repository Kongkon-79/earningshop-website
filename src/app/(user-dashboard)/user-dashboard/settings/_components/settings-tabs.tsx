"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { settingsLinks } from "../settings-links";

export default function SettingsTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="সেটিংস পেজ" className="grid w-full grid-cols-2 gap-1 rounded-2xl border border-teal-900/10 bg-white p-1 shadow-sm sm:w-fit">
      {settingsLinks.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-sm font-semibold leading-snug sm:min-h-11 sm:flex-row focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:gap-2 sm:px-4",
              active ? "bg-teal-900 text-white" : "text-slate-700 hover:bg-teal-50 hover:text-teal-900",
            )}
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            <span className="min-w-0 [overflow-wrap:anywhere]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
