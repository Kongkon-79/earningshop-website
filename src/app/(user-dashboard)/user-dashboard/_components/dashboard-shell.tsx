"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import UserDashboardHeader from "./user-dash-header";
import UserDashboardSidebar from "./user-dash-sidebar";

type DashboardShellProps = {
  fullName: string;
  initiallyCollapsed: boolean;
  sidebarCookieName: string;
  children: ReactNode;
};

export default function DashboardShell({ fullName, initiallyCollapsed, sidebarCookieName, children }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${sidebarCookieName}=${next ? "collapsed" : "expanded"}; Path=/user-dashboard; Max-Age=31536000; SameSite=Lax${secure}`;
  }

  return (
    <div
      lang="bn"
      className={cn(
        "grid min-h-dvh bg-[#f4f7f2] font-sans text-slate-900 [--dashboard-gutter:0.75rem] sm:[--dashboard-gutter:1rem] lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--dashboard-gutter:1.25rem]",
        collapsed ? "lg:[--sidebar-width:4.5rem]" : "lg:[--sidebar-width:14rem] xl:[--sidebar-width:16rem]",
      )}
    >
      <a href="#dashboard-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-40 focus:rounded-lg focus:bg-white focus:p-3 focus:outline-teal-700">
        মূল কনটেন্টে যান
      </a>
      <aside id="desktop-dashboard-sidebar" className="sticky top-0 hidden h-dvh overflow-hidden border-r border-slate-200 bg-white lg:block">
        <UserDashboardSidebar collapsed={collapsed} />
      </aside>
      <div className="min-w-0">
        <UserDashboardHeader fullName={fullName} sidebarCollapsed={collapsed} onToggleSidebar={toggleSidebar} />
        <main id="dashboard-content" tabIndex={-1} className="scroll-mt-32 px-[var(--dashboard-gutter)] pb-6 focus:outline-none lg:pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
