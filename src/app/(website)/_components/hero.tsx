"use client";

import { ArrowRight, BadgeCheck, Check, Copy, Users, Wallet } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Reveal, useWebsiteReducedMotion } from "./website-motion";

const referralCode = "RH7X4K";
const activity = [
  { label: "কাজের রিওয়ার্ড", detail: "অনুমোদিত · আজ", amount: "+৳ ৩৫" },
  { label: "রেফারেল বোনাস", detail: "১ জন নতুন সদস্য", amount: "+৳ ৩০" },
  { label: "উইথড্র রিকোয়েস্ট", detail: "প্রসেসিং", amount: "−৳ ৬০০" },
];
const notes = [
  { icon: BadgeCheck, label: "ম্যানুয়াল অ্যাডমিন যাচাই" },
  { icon: Wallet, label: "কোনো অটো পেমেন্ট নেই" },
  { icon: Users, label: "৭% উইথড্র চার্জ" },
];
const focusStyle =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700";

export default function Hero() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const reduceMotion = useWebsiteReducedMotion();

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section
      aria-labelledby="home-title"
      className="border-b border-teal-900/10 bg-[#f7f7ef] bg-[radial-gradient(ellipse_at_top_right,_#d9eee4,_transparent_65%)]"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-7 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-14">
        <Reveal className="min-w-0">
          <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-teal-900/15 bg-white/75 px-3 py-1.5 text-sm font-semibold text-teal-900">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-teal-700" />
            মোবাইল-ফ্রেন্ডলি রেফারেল ও ওয়ার্ক প্ল্যাটফর্ম
          </p>
          <h1 id="home-title" className="mt-3 text-balance text-[clamp(1.875rem,3.6vw,3.125rem)] font-bold leading-[1.2] text-slate-900">
            কাজ করুন, রেফার করুন
            <span className="mt-1 block text-teal-800">আয় বাড়ান</span>
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-slate-700">
            নিজের প্রোফাইল, রেফারেল লিংক, ব্যালেন্স, কাজ, ট্রেনিং ভিডিও,
            জেনারেশন ট্রি এবং উইথড্র রিকোয়েস্ট এক জায়গায়। প্রতিটি আয় অ্যাডমিন
            যাচাইয়ের পর ব্যালেন্সে যোগ হয়।
          </p>

          <div className="mt-5 grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <Link href="/sign-up" className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-900 px-4 motion-safe:transition-[background-color,transform] motion-safe:active:scale-[0.98] py-2.5 text-sm font-bold text-white hover:bg-teal-800 sm:px-5 ${focusStyle}`}>
              ফ্রি অ্যাকাউন্ট খুলুন
              <ArrowRight aria-hidden="true" className="size-4 shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1" />
            </Link>
            <a href="#how-it-works" className={`inline-flex min-h-11 items-center justify-center rounded-xl border border-teal-900/20 bg-white px-4 motion-safe:transition-colors py-2.5 text-sm font-semibold text-teal-900 hover:bg-teal-50 sm:px-5 ${focusStyle}`}>
              কীভাবে কাজ করে
            </a>
          </div>

          <ul role="list" className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-700">
            {notes.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5">
                <Icon aria-hidden="true" className="size-4 shrink-0 text-teal-800" />
                {label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08} className="min-w-0 overflow-hidden rounded-3xl border border-teal-900/15 bg-white shadow-lg shadow-teal-950/10">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-100 bg-teal-50 px-4 py-4 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold text-teal-950">নমুনা ব্যালেন্স</h2>
              <p className="mt-1 text-2xl font-bold leading-tight tabular-nums text-teal-950 sm:text-3xl">৳১,২৪০</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-teal-900">সক্রিয়</span>
          </div>

          <div className="space-y-3 p-4 sm:px-6 sm:py-5">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-900 p-3 text-white">
              <div>
                <p className="text-sm text-slate-300">নমুনা রেফারেল কোড</p>
                <code lang="en" className="select-all font-semibold tracking-widest">{referralCode}</code>
              </div>
              <button
                type="button"
                onClick={copyCode}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-white/15 px-3 text-sm font-semibold hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {copyStatus === "copied" ? (
                  <m.span
                    aria-hidden="true"
                    className="shrink-0 text-emerald-300"
                    animate={{ scale: reduceMotion ? 1 : [0.78, 1.2, 1] }}
                    transition={{ duration: reduceMotion ? 0 : 0.3 }}
                  >
                    <Check className="size-4" />
                  </m.span>
                ) : (
                  <Copy aria-hidden="true" className="size-4 shrink-0" />
                )}
                {copyStatus === "copied" ? "কপি হয়েছে" : "কপি করুন"}
              </button>
            </div>
            <p role="status" className={copyStatus === "error" ? "text-sm text-red-800" : "sr-only"}>
              {copyStatus === "error" && "কপি করা যায়নি। কোডটি নির্বাচন করে কপি করুন।"}
              {copyStatus === "copied" && "নমুনা রেফারেল কোড কপি হয়েছে।"}
            </p>
            <ul role="list" aria-label="নমুনা লেনদেন" className="divide-y divide-slate-200">
              {activity.map(({ label, detail, amount }) => (
                <li key={label} className="flex items-center justify-between gap-2 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{label}</p>
                    <p className="text-slate-600">{detail}</p>
                  </div>
                  <span className={`shrink-0 whitespace-nowrap font-semibold tabular-nums ${amount.startsWith("+") ? "text-teal-900" : "text-slate-700"}`}>
                    {amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
