import {
  ArrowRight, Banknote, BriefcaseBusiness, CircleCheck, CirclePlay, Inbox,
  UsersRound, Wallet,
} from "lucide-react";
import { getDashboardUser } from "@/lib/dashboard-auth";
import { getDashboardOverview } from "@/lib/dashboard-overview";
import DashboardReferralCard from "./dashboard-referral-card";

const numberFormat = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 2 });
const dateFormat = new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium", timeZone: "Asia/Dhaka" });

function formatAmount(value: number | null | undefined, currency = "") {
  return value == null ? "—" : `${currency}${numberFormat.format(value)}`;
}

function formatDate(value: string | null | undefined) {
  const timestamp = value ? Date.parse(value) : NaN;
  return Number.isFinite(timestamp) ? dateFormat.format(timestamp) : undefined;
}

export default async function OverviewContainer() {
  const user = await getDashboardUser();
  const { balance, pending, approved, recentRewards } = await getDashboardOverview(user.accessToken);
  const stats = [
    { title: "মোট আয়", value: formatAmount(balance, "৳"), detail: "কাজের রিওয়ার্ড", icon: Wallet },
    { title: "সরাসরি রেফারেল", value: "—", detail: "গণনার তথ্য পাওয়া যায়নি", icon: UsersRound },
    { title: "পেন্ডিং কাজ", value: formatAmount(pending), detail: "যাচাইয়ের অপেক্ষায়", icon: BriefcaseBusiness },
    { title: "অ্যাপ্রুভড কাজ", value: formatAmount(approved), detail: "সর্বমোট", icon: CircleCheck },
  ];
  const unavailableActions = [
    { label: "উইথড্র", icon: Banknote },
    { label: "জেনারেশন", icon: UsersRound },
    { label: "ভিডিও", icon: CirclePlay },
  ];

  return (
    <div className="space-y-4 pt-[var(--dashboard-gutter)] sm:space-y-5">
      <section aria-labelledby="overview-welcome-title" className="rounded-2xl bg-teal-900 bg-gradient-to-br from-emerald-900 via-teal-800 to-teal-700 px-4 py-5 text-white sm:p-6 lg:p-7">
        <p className="text-sm font-semibold text-emerald-100">আপনার ড্যাশবোর্ড</p>
        <h2 id="overview-welcome-title" className="mt-2 text-xl font-bold leading-snug [overflow-wrap:anywhere] sm:text-2xl">
          স্বাগতম, {user.fullName}
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-teal-50">
          ব্যালেন্স, রেফারেল, কাজ ও উইথড্রের তথ্য এক জায়গায় দেখুন।
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-white/15 px-3 py-2">
            <p className="text-xs font-medium text-teal-50">ব্যালেন্স</p>
            <p className="text-xl font-bold tabular-nums">{formatAmount(balance, "৳")}</p>
          </div>
          <button type="button" disabled className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-xl bg-white/90 px-3 text-sm font-semibold text-teal-950" aria-describedby="withdraw-status">
            উইথড্র করুন
            <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
          </button>
          <p id="withdraw-status" className="text-xs text-teal-50">উত্তোলন চালু হয়নি</p>
        </div>
      </section>

      <dl id="task-summary" aria-label="অ্যাকাউন্ট ও কাজের সারাংশ" className="grid scroll-mt-32 grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
        {stats.map(({ title, value, detail, icon: Icon }) => (
          <div key={title} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <dt className="flex min-h-9 items-center justify-between gap-1.5 text-xs font-medium leading-relaxed text-slate-700 sm:text-sm">
              {title}
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-800">
                <Icon aria-hidden="true" className="size-4" />
              </span>
            </dt>
            <dd className="mt-2 text-xl font-bold tabular-nums text-slate-900 [overflow-wrap:anywhere] sm:text-2xl">{value}</dd>
            <dd className="mt-1 text-xs leading-relaxed text-slate-600">{detail}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <DashboardReferralCard referralCode={user.referralCode} detailsHref="/user-dashboard/referral" />

        <section aria-labelledby="recent-transactions-title" className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="recent-transactions-title" className="font-bold text-slate-900">সাম্প্রতিক লেনদেন</h2>
            <span className="text-xs font-semibold text-teal-800">কাজের রিওয়ার্ড</span>
          </div>
          {recentRewards?.length ? (
            <ul className="mt-3 divide-y divide-slate-200">
              {recentRewards.map((reward) => {
                const date = formatDate(reward.reviewedAt);
                return (
                  <li key={reward._id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 [overflow-wrap:anywhere]">{reward.taskTitle}</p>
                      {date && <p className="mt-0.5 text-xs text-slate-600">{date}</p>}
                    </div>
                    <span className="shrink-0 whitespace-nowrap font-semibold tabular-nums text-teal-900">
                      {formatAmount(reward.reward, "৳")}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-3 flex min-h-40 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 py-5 text-center">
              <span className="mb-3 grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-600">
                <Inbox aria-hidden="true" className="size-5" />
              </span>
              <p className="text-sm font-semibold text-slate-900">
                {recentRewards ? "এখনও কোনো লেনদেন নেই" : "লেনদেনের তথ্য পাওয়া যায়নি"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {recentRewards ? "অনুমোদিত কাজের রিওয়ার্ড এখানে দেখাবে।" : "কিছুক্ষণ পর আবার পেজটি খুলুন।"}
              </p>
            </div>
          )}
        </section>
      </div>

      <section aria-label="দ্রুত অ্যাকশন" className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
        <a href="#task-summary" className="flex min-h-16 flex-col items-start justify-center gap-1.5 rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-teal-300 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:p-4">
          <BriefcaseBusiness aria-hidden="true" className="size-5 text-teal-800" />
          কাজের হিসাব দেখুন
        </a>
        {unavailableActions.map(({ label, icon: Icon }) => (
          <button key={label} type="button" disabled className="flex min-h-16 cursor-not-allowed flex-col items-start justify-center gap-1 rounded-xl border border-slate-200 bg-white p-3 text-left text-sm text-slate-700 shadow-sm sm:p-4">
            <Icon aria-hidden="true" className="size-5 text-teal-800" />
            <span className="font-semibold">{label}</span>
            <span className="text-xs text-slate-600">চালু হয়নি</span>
          </button>
        ))}
      </section>
    </div>
  );
}
