import { Info, UsersRound } from "lucide-react";
import { getDashboardUser } from "@/lib/dashboard-auth";
import DashboardReferralCard from "../../_components/dashboard-referral-card";

export default async function ReferralContainer() {
  const user = await getDashboardUser();

  return (
    <div className="grid gap-[var(--dashboard-gutter)] pt-[var(--dashboard-gutter)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="grid content-start gap-3 sm:gap-4">
        <DashboardReferralCard referralCode={user.referralCode} />

        <aside className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 sm:p-5">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-800" />
          <p>রেফারেল বোনাস স্বয়ংক্রিয়ভাবে যোগ হয় না। অ্যাডমিন যাচাই করে ম্যানুয়ালি ব্যালেন্সে যোগ করবেন।</p>
        </aside>
      </div>

      <section aria-labelledby="direct-referrals-title" className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 id="direct-referrals-title" className="text-lg font-bold leading-snug text-slate-900 sm:text-xl">
            সরাসরি রেফারেল
          </h2>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-50 text-sm font-bold text-teal-900">
            <span aria-hidden="true">—</span>
            <span className="sr-only">রেফারেলের সংখ্যা পাওয়া যায়নি</span>
          </span>
        </div>

        <div className="mt-4 flex min-h-52 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center sm:min-h-60">
          <span className="grid size-12 place-items-center rounded-xl bg-slate-100 text-slate-600">
            <UsersRound aria-hidden="true" className="size-6" />
          </span>
          <p className="mt-4 font-semibold text-slate-900">রেফারেলের তালিকা এখনো উপলভ্য নেই</p>
          <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-600">
            আপনার রেফারেল লিংক কপি করে অন্যদের সঙ্গে শেয়ার করুন।
          </p>
        </div>
      </section>
    </div>
  );
}
