import { UserRound } from "lucide-react";
import { getDashboardUser } from "@/lib/dashboard-auth";

export default async function PersonalInformation() {
  const user = await getDashboardUser();

  return (
    <section aria-labelledby="profile-details-title" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex min-w-0 items-center gap-3 border-b border-teal-100 bg-teal-50 p-4 sm:p-6">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-teal-900">
          <UserRound aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 id="profile-details-title" className="[overflow-wrap:anywhere] text-lg font-bold text-teal-950">{user.fullName}</h2>
          <p className="text-sm text-teal-900">অ্যাকাউন্ট প্রোফাইল</p>
        </div>
      </div>
      <dl className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6 2xl:grid-cols-4">
        <div className="min-w-0 rounded-xl border border-slate-200 p-3">
          <dt className="text-sm text-slate-600">পূর্ণ নাম</dt>
          <dd className="mt-1 [overflow-wrap:anywhere] font-semibold">{user.fullName}</dd>
        </div>
        <div className="min-w-0 rounded-xl border border-slate-200 p-3">
          <dt className="text-sm text-slate-600">ইমেইল</dt>
          <dd className="mt-1 [overflow-wrap:anywhere] font-semibold" dir="ltr">{user.email}</dd>
          <dd className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            {user.emailVerified ? "যাচাই সম্পন্ন" : "যাচাই হয়নি"}
          </dd>
        </div>
        <div className="min-w-0 rounded-xl border border-slate-200 p-3">
          <dt className="text-sm text-slate-600">ফোন নম্বর</dt>
          <dd className="mt-1 [overflow-wrap:anywhere] font-semibold" dir="ltr">{user.phoneNumber || "যোগ করা হয়নি"}</dd>
        </div>
        <div className="min-w-0 rounded-xl border border-slate-200 p-3">
          <dt className="text-sm text-slate-600">রেফারেল কোড</dt>
          <dd className="mt-1 [overflow-wrap:anywhere] font-semibold" dir="ltr">
            {user.referralCode ? <code>{user.referralCode}</code> : "এখনও নেই"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
