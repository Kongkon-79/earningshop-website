"use client";

import { ArrowRight, Copy, Link2, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const actionClass = "inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300";

export default function DashboardReferralCard({ referralCode, detailsHref }: { referralCode?: string; detailsHref?: string }) {
  const [origin, setOrigin] = useState("");
  const [message, setMessage] = useState("");
  const linkInput = useRef<HTMLInputElement>(null);

  useEffect(() => setOrigin(window.location.origin), []);

  const signupPath = referralCode ? `/sign-up?${new URLSearchParams({ ref: referralCode })}` : "";
  const referralUrl = signupPath && origin ? new URL(signupPath, origin).href : signupPath;

  async function copy(value: string, label: string, isLink = false) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(`${label} কপি হয়েছে।`);
    } catch {
      if (isLink) {
        linkInput.current?.focus();
        linkInput.current?.select();
      }
      setMessage(isLink ? "লিংকটি নির্বাচন করা হয়েছে। এখন কপি করুন।" : "কোডটি নির্বাচন করে কপি করুন।");
    }
  }

  async function shareLink() {
    if (!signupPath) return;
    const fullUrl = new URL(signupPath, window.location.origin).href;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "আর্নিংশপ রেফারেল লিংক", url: fullUrl });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    await copy(fullUrl, "রেফারেল লিংক", true);
  }

  return (
    <section aria-labelledby="referral-card-title" className="min-w-0 rounded-2xl bg-slate-900 p-4 text-white shadow-sm sm:p-5 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 id="referral-card-title" className="flex items-center gap-2 text-base font-bold text-emerald-300">
          <Link2 aria-hidden="true" className="size-5 shrink-0" />
          আপনার রেফারেল লিংক
        </h2>
        {detailsHref && (
          <Link href={detailsHref} className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-semibold text-emerald-200 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300">
            রেফারেল দেখুন
            <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
          </Link>
        )}
      </div>
      {referralCode ? (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-300">কোড</p>
              <code className="select-all text-lg font-bold tracking-widest [overflow-wrap:anywhere]">{referralCode}</code>
            </div>
            <button type="button" onClick={() => copy(referralCode, "রেফারেল কোড")} className={`${actionClass} bg-white/10 text-white hover:bg-white/20`}>
              <Copy aria-hidden="true" className="size-4 shrink-0" />
              কোড কপি
            </button>
          </div>
          <input
            ref={linkInput}
            aria-label="রেফারেল লিংক"
            type="text"
            dir="ltr"
            value={referralUrl}
            readOnly
            onFocus={(event) => event.currentTarget.select()}
            className="h-11 w-full min-w-0 rounded-xl border border-white/20 bg-white/10 px-3 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
          />
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => copy(new URL(signupPath, window.location.origin).href, "রেফারেল লিংক", true)} className={`${actionClass} bg-emerald-700 text-white hover:bg-emerald-600`}>
              <Copy aria-hidden="true" className="size-4 shrink-0" />
              লিংক কপি
            </button>
            <button type="button" onClick={shareLink} className={`${actionClass} border border-white/25 text-white hover:bg-white/10`}>
              <Share2 aria-hidden="true" className="size-4 shrink-0" />
              শেয়ার করুন
            </button>
          </div>
          <p role="status" className={message ? "text-sm text-emerald-200" : "sr-only"}>{message}</p>
        </div>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-slate-300">এই অ্যাকাউন্টে রেফারেল কোড পাওয়া যায়নি।</p>
      )}
    </section>
  );
}
