import { Info, ReceiptText, Wallet } from "lucide-react";

const generationCount = 5;
const generationShare = 4;
const shares = [
  { label: "রেফারেল বোনাস", amount: 30 },
  {
    label: "জেনারেশন",
    detail: `${formatNumber(generationCount)} × ${formatTaka(generationShare)}`,
    amount: generationCount * generationShare,
  },
  { label: "অ্যাডমিন শেয়ার", amount: 7 },
  { label: "কোম্পানি শেয়ার", amount: 13 },
];
const total = shares.reduce((sum, { amount }) => sum + amount, 0);
const withdrawalExample = 100;
const withdrawalFeePercent = 7;
const netWithdrawal = withdrawalExample * (100 - withdrawalFeePercent) / 100;

function formatNumber(amount: number) {
  return amount.toLocaleString("bn-BD");
}

function formatTaka(amount: number) {
  return `৳${formatNumber(amount)}`;
}

export default function Packages() {
  return (
    <section
      id="packages"
      lang="bn"
      aria-labelledby="packages-title"
      className="scroll-mt-24 border-y border-slate-200 bg-slate-50 font-sans text-slate-900"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold text-teal-800">প্যাকেজ</p>
          <h2 id="packages-title" className="mt-2 text-balance text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl">
            {formatTaka(total)} এন্ট্রি প্যাকেজের গঠন
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            এন্ট্রি ফি কীভাবে ভাগ হয়, তার হিসাব এখানে দেখুন। রেফারেল ও জেনারেশনের
            অঙ্কগুলো প্রদর্শনের জন্য দেওয়া হয়েছে। স্বয়ংক্রিয় কমিশন পেমেন্ট চালু নেই।
          </p>
        </header>

        <div className="mt-6 grid items-start gap-4 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:mt-8 lg:gap-6">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-100 bg-teal-50 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-teal-900">
                  <ReceiptText aria-hidden="true" className="size-5" />
                </span>
                <h3 className="font-semibold text-teal-950">মোট এন্ট্রি ফি</h3>
              </div>
              <p className="whitespace-nowrap text-2xl font-bold leading-none tabular-nums text-teal-900 sm:text-3xl">
                {formatTaka(total)}
              </p>
            </div>

            <dl className="divide-y divide-slate-200 px-4 sm:px-6">
              {shares.map(({ label, detail, amount }) => (
                <div key={label} className="flex items-baseline justify-between gap-3 py-3">
                  <dt className="min-w-0 text-sm font-medium text-slate-700 sm:text-base">
                    {label}
                    {detail && <span className="ml-2 inline-block text-sm text-slate-600">({detail})</span>}
                  </dt>
                  <dd className="shrink-0 whitespace-nowrap font-semibold tabular-nums text-slate-900">
                    {formatTaka(amount)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-900">
                <Wallet aria-hidden="true" className="size-5" />
              </span>
              <h3 className="text-lg font-semibold leading-snug">উত্তোলনের উদাহরণ</h3>
            </div>

            <dl className="mt-4 space-y-3">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-sm text-slate-700 sm:text-base">উত্তোলনে সার্ভিস চার্জ</dt>
                <dd className="shrink-0 font-semibold tabular-nums">{formatNumber(withdrawalFeePercent)}%</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 rounded-xl bg-teal-50 px-3 py-3 text-teal-950 sm:px-4">
                <dt className="text-sm font-semibold sm:text-base">{formatTaka(withdrawalExample)} উত্তোলনে হাতে পাবেন</dt>
                <dd className="shrink-0 text-xl font-bold tabular-nums">{formatTaka(netWithdrawal)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950 lg:mt-6">
          <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-800" />
          <p>
            এন্ট্রি ফি ও কমিশনের নীতিমালা মালিকের লিখিত অনুমোদন সাপেক্ষে কার্যকর হবে।
            পেমেন্ট অ্যাডমিন যাচাইয়ের পর ম্যানুয়ালি সম্পন্ন হয়।
          </p>
        </div>
      </div>
    </section>
  );
}
