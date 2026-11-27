"use client";

import { ChevronDown, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import LogoutModal from "@/components/modals/LogoutModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { settingsLinks } from "../settings/settings-links";

const [profileSettings, passwordSettings] = settingsLinks;
const PasswordIcon = passwordSettings.icon;
const itemClass = "min-h-11 cursor-pointer rounded-lg px-3 font-medium focus:bg-teal-50 focus:text-teal-900";

export default function AccountMenu({ fullName, profileAvatar }: { fullName: string; profileAvatar: ReactNode }) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const logoutRequested = useRef(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            ref={trigger}
            aria-label={fullName ? fullName + " অ্যাকাউন্ট মেনু" : "অ্যাকাউন্ট মেনু"}
            className="flex min-h-11 min-w-0 max-w-44 items-center gap-1.5 rounded-xl p-1 text-slate-700 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 data-[state=open]:bg-teal-50 sm:gap-2 xl:max-w-60"
          >
            {profileAvatar}
            <span className="hidden min-w-0 truncate text-sm font-semibold md:block">{fullName}</span>
            <ChevronDown aria-hidden="true" className="hidden size-4 shrink-0 text-slate-500 sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          lang="bn"
          align="end"
          sideOffset={8}
          collisionPadding={8}
          className="w-56 max-w-[calc(100vw_-_1rem)] rounded-xl border-slate-200 bg-white p-1.5 font-sans text-slate-900 shadow-lg motion-reduce:animate-none"
          onCloseAutoFocus={(event) => {
            if (!logoutRequested.current) return;
            event.preventDefault();
            logoutRequested.current = false;
            setLogoutOpen(true);
          }}
        >
          <DropdownMenuLabel className="px-3 py-2 [overflow-wrap:anywhere]">{fullName || "অ্যাকাউন্ট"}</DropdownMenuLabel>
          <DropdownMenuSeparator className="mx-1 bg-slate-200" />
          <DropdownMenuItem asChild className={itemClass}>
            <Link href={profileSettings.href}>
              <Settings aria-hidden="true" />
              সেটিংস
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={itemClass}>
            <Link href={passwordSettings.href}>
              <PasswordIcon aria-hidden="true" />
              {passwordSettings.label}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="mx-1 bg-slate-200" />
          <DropdownMenuItem
            aria-haspopup="dialog"
            className={cn(itemClass, "text-red-700 focus:bg-red-50 focus:text-red-800")}
            onSelect={() => { logoutRequested.current = true; }}
          >
            <LogOut aria-hidden="true" />
            লগআউট
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutModal open={logoutOpen} onOpenChange={setLogoutOpen} returnFocusRef={trigger} />
    </>
  );
}
