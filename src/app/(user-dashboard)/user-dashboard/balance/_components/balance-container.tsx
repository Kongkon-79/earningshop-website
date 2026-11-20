import { Wallet } from "lucide-react";
import { getDashboardUser } from "@/lib/dashboard-auth";
import { getTaskRewardBalance } from "@/lib/dashboard-overview";

const numberFormat = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 2 });

export default async function BalanceContainer() {
  const user = await getDashboardUser();
  const balance = await getTaskRewardBalance(user.accessToken);

  return (
    <div className="pt-[var(--dashboard-gutter)]">
      <section aria-labelledby="reward-balance-title" className="flex max-w-lg items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-900">
          <Wallet aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 id="reward-balance-title" className="font-semibold text-slate-800">কাজের রিওয়ার্ড ব্যালেন্স</h2>
          <p className="mt-1 text-2xl font-bold tabular-nums text-teal-950 [overflow-wrap:anywhere]">
            {balance === null ? "—" : `৳${numberFormat.format(balance)}`}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {balance === null ? "ব্যালেন্সের তথ্য পাওয়া যায়নি।" : "অনুমোদিত কাজ থেকে জমা হওয়া রিওয়ার্ড।"}
          </p>
        </div>
      </section>
    </div>
  );
}
