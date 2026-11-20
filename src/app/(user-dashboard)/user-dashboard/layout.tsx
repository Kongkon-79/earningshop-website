import type { ReactNode } from "react";
import { getDashboardUser } from "@/lib/dashboard-auth";
import UserDashboardHeader from "./_components/user-dash-header";
import UserDashboardSidebar from "./_components/user-dash-sidebar";

export default async function UserDashboardLayout({ children }: { children: ReactNode }) {
  const user = await getDashboardUser();

  return (
    <div lang="bn" className="grid min-h-dvh bg-[#f4f7f2] font-sans text-slate-900 [--dashboard-gutter:0.75rem] sm:[--dashboard-gutter:1rem] lg:grid-cols-[14rem_minmax(0,1fr)] lg:[--dashboard-gutter:1.25rem] xl:grid-cols-[16rem_minmax(0,1fr)]">
      <a href="#dashboard-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-40 focus:rounded-lg focus:bg-white focus:p-3 focus:outline-teal-700">
        মূল কনটেন্টে যান
      </a>
      <aside className="sticky top-0 hidden h-dvh overflow-y-auto overscroll-contain border-r border-slate-200 bg-white lg:block">
        <UserDashboardSidebar />
      </aside>
      <div className="min-w-0">
        <UserDashboardHeader fullName={user.fullName} />
        <main id="dashboard-content" tabIndex={-1} className="scroll-mt-32 px-[var(--dashboard-gutter)] pb-6 focus:outline-none lg:pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
