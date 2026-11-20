import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getDashboardUser } from "@/lib/dashboard-auth";
import ChangePasswordForm from "./_components/change-password-form";

export default async function ChangePasswordPage() {
  await getDashboardUser();

  return (
    <div className="grid max-w-5xl items-start gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,18rem)]">
      <ChangePasswordForm />
      <aside className="rounded-2xl border border-teal-200 bg-teal-50 p-4 sm:p-5">
        <ShieldCheck aria-hidden="true" className="size-6 text-teal-800" />
        <h2 className="mt-2 font-bold text-teal-950">অ্যাকাউন্ট সুরক্ষা</h2>
        <p className="mt-1 text-sm leading-relaxed text-teal-950">
          অন্য কোনো অ্যাকাউন্টে ব্যবহার করেননি, এমন একটি পাসওয়ার্ড বেছে নিন।
        </p>
        <Link href="/forgot-password" className="mt-2 inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-teal-900 underline-offset-4 hover:underline focus-visible:outline-teal-700">
          বর্তমান পাসওয়ার্ড ভুলে গেছেন?
        </Link>
      </aside>
    </div>
  );
}
