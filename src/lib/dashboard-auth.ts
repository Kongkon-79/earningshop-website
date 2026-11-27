import { cache } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { createAuthOptions } from "./auth";
import { getAccountProfile } from "./backend-profile";

export const getDashboardUser = cache(async () => {
  const session = await getServerSession(createAuthOptions());
  if (!session?.user?.accessToken) {
    redirect("/login?callbackUrl=%2Fuser-dashboard");
  }
  return session.user;
});

export const getDashboardProfile = cache(async () => {
  const user = await getDashboardUser();
  const profile = await getAccountProfile(user.accessToken);
  return profile?.id === user.id ? profile : null;
});
