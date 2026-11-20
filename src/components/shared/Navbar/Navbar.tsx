"use client";

import { LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState, type ReactNode } from "react";

const links = [
  { label: "সুবিধা", href: "/#features" },
  { label: "কীভাবে কাজ করে", href: "/#how-it-works" },
  { label: "প্যাকেজ", href: "/#packages" },
  { label: "প্রোডাক্ট", href: "/#products" },
];

const linkAppearance =
  "min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900";
const linkStyle = `inline-flex ${linkAppearance}`;
const loginStyle =
  "min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-teal-200 bg-teal-50 px-3 text-sm font-semibold text-teal-900 transition-colors hover:border-teal-300 hover:bg-teal-100 active:bg-teal-200 motion-reduce:transition-none";

export default function Navbar({ cartAction }: { cartAction?: ReactNode }) {
  const { data: session } = useSession();
  const isSignedIn = Boolean(session?.user);
  const accountHref = isSignedIn ? "/user-dashboard" : "/login";
  const accountLabel = isSignedIn ? "ড্যাশবোর্ড" : "লগইন";
  const AccountIcon = isSignedIn ? LayoutDashboard : LogIn;
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setOpen(false);

  return (
    <header
      lang="bn"
      className="sticky top-0 z-40 border-b border-teal-900/10 bg-white/95 font-sans text-slate-900 backdrop-blur-sm [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-teal-700"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          closeMenu();
          menuButton.current?.focus();
        }
      }}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-10 focus:rounded-lg focus:bg-white focus:p-3">
        মূল কনটেন্টে যান
      </a>
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:min-h-[72px] lg:gap-4 lg:px-8">
        <Link href="/" onClick={closeMenu} className="flex shrink-0 items-center rounded-lg">
          <Image
            src="/assets/images/logo.png"
            alt="Earningshop Limited"
            width={715}
            height={349}
            sizes="(min-width: 640px) 128px, 104px"
            className="h-auto w-[104px] sm:w-32"
            priority
          />
        </Link>

        <nav aria-label="প্রধান ন্যাভিগেশন" className="hidden items-center gap-1 lg:flex">
          {links.map(({ label, href }) => (
            <Link key={href} href={href} className={linkStyle}>{label}</Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {cartAction}
          <Link href={accountHref} className={`hidden lg:inline-flex ${loginStyle}`}>
            <AccountIcon aria-hidden="true" className="size-4 shrink-0" />
            {accountLabel}
          </Link>
          {!isSignedIn && (
            <Link
              href="/sign-up"
              onClick={closeMenu}
              className="hidden min-h-11 items-center whitespace-nowrap rounded-xl bg-teal-900 px-4 text-sm font-semibold text-white hover:bg-teal-800 min-[420px]:inline-flex"
            >
              শুরু করুন
            </Link>
          )}
          <button
            ref={menuButton}
            type="button"
            aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((previous) => !previous)}
            className="grid size-11 place-items-center rounded-xl border border-teal-900/15 bg-white text-teal-900 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 lg:hidden"
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>

        <nav
          id={menuId}
          hidden={!open}
          aria-label="মোবাইল ন্যাভিগেশন"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-teal-900/10 bg-white px-4 py-3 shadow-lg sm:px-6 lg:hidden"
        >
          <ul className="grid grid-cols-2 gap-1">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} onClick={closeMenu} className={`${linkStyle} w-full`}>{label}</Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap gap-2 border-t border-teal-900/10 pt-2">
            <Link href={accountHref} onClick={closeMenu} className={`inline-flex ${loginStyle}`}>
              <AccountIcon aria-hidden="true" className="size-4 shrink-0" />
              {accountLabel}
            </Link>
            {!isSignedIn && <Link href="/sign-up" onClick={closeMenu} className={`min-[420px]:hidden ${linkStyle}`}>শুরু করুন</Link>}
          </div>
        </nav>
      </div>
    </header>
  );
}
