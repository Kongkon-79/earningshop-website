import { cookies } from "next/headers";
import { Suspense, type ReactNode } from "react";
import ProfileAvatar from "@/components/ui/profile-avatar";
import { getDashboardProfile, getDashboardUser } from "@/lib/dashboard-auth";
import DashboardShell from "./_components/dashboard-shell";

const sidebarCookieName = "dashboard-sidebar";

async function DashboardProfileAvatar() {
  const profile = await getDashboardProfile().catch(() => null);
  return <ProfileAvatar src={profile?.profilePicture} className="size-9 sm:size-10" />;
}

export default async function UserDashboardLayout({ children }: { children: ReactNode }) {
  const user = await getDashboardUser();

  return (
    <DashboardShell
      fullName={user.fullName}
      profileAvatar={
        <Suspense fallback={<ProfileAvatar className="size-9 sm:size-10" />}>
          <DashboardProfileAvatar />
        </Suspense>
      }
      initiallyCollapsed={cookies().get(sidebarCookieName)?.value === "collapsed"}
      sidebarCookieName={sidebarCookieName}
    >
      {children}
    </DashboardShell>
  );
}
