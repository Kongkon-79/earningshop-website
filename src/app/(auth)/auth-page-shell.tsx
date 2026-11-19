import { GitBranch, ShieldCheck, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const benefits = [
  { icon: ShoppingBag, title: "বেবি প্রোডাক্ট", description: "শিশুর প্রয়োজনীয় পণ্য এক জায়গায় দেখুন।" },
  { icon: GitBranch, title: "রেফারেল", description: "নিজের রেফারেল ও টিমের হিসাব দেখুন।" },
  { icon: ShieldCheck, title: "ম্যানুয়াল যাচাই", description: "পেমেন্ট অ্যাডমিন যাচাই করেন।" },
];

export default function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <main lang="bn" className="grid min-h-dvh grid-rows-[auto_1fr] bg-[#faf9f4] font-sans lg:grid-cols-2 lg:grid-rows-1 [@media(min-width:640px)_and_(max-height:500px)]:grid-cols-[minmax(7.5rem,1fr)_3fr] [@media(min-width:640px)_and_(max-height:500px)]:grid-rows-1">
      <aside className="flex min-w-0 flex-col justify-between gap-6 bg-slate-900 bg-[radial-gradient(ellipse_at_top_right,_#123c3a,_transparent_65%)] px-4 py-2 text-white sm:px-6 lg:px-10 lg:py-6 xl:px-14 [@media(min-width:640px)_and_(max-height:500px)]:items-center [@media(min-width:640px)_and_(max-height:500px)]:justify-center [@media(min-width:640px)_and_(max-height:500px)]:px-2">
        <Link
          href="/"
          aria-label="Earningshop Limited হোমপেজ"
          className="inline-flex w-fit rounded-lg bg-white px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
        >
          <Image
            src="/assets/images/logo.png"
            alt=""
            width={715}
            height={349}
            sizes="(min-width: 1024px) 144px, 96px"
            className="h-auto w-24 lg:w-36"
            priority
          />
        </Link>

        <div className="hidden lg:block [@media(min-width:640px)_and_(max-height:500px)]:hidden">
          <p className="max-w-lg text-3xl font-bold leading-snug xl:text-4xl">
            বেবি পণ্য ও রেফারেল
            <span className="mt-1 block text-emerald-300">সব এক ড্যাশবোর্ডে</span>
          </p>
          <ul className="mt-6 space-y-4">
            {benefits.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-emerald-300">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm leading-relaxed text-slate-300">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="hidden text-sm text-slate-300 lg:block [@media(min-width:640px)_and_(max-height:500px)]:hidden" lang="en">
          © {new Date().getFullYear()} Earningshop Limited
        </p>
      </aside>

      <div className="grid min-w-0 place-items-center px-4 py-4 sm:px-6 lg:py-6 [@media(min-width:640px)_and_(max-height:500px)]:py-2">
        <div className="w-full max-w-md text-slate-900">{children}</div>
      </div>
    </main>
  );
}
