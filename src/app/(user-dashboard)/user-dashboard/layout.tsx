import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { getDashboardUser } from "@/lib/dashboard-auth";
import DashboardShell from "./_components/dashboard-shell";

const sidebarCookieName = "dashboard-sidebar";

export default async function UserDashboardLayout({ children }: { children: ReactNode }) {
  const user = await getDashboardUser();

  return (
    <DashboardShell
      fullName={user.fullName}
      initiallyCollapsed={cookies().get(sidebarCookieName)?.value === "collapsed"}
      sidebarCookieName={sidebarCookieName}
    >
      {children}
    </DashboardShell>
  );
}
