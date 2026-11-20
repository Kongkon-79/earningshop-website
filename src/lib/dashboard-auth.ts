import { cache } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { createAuthOptions } from "./auth";

export const getDashboardUser = cache(async () => {
  const session = await getServerSession(createAuthOptions());
  if (!session?.user?.accessToken) {
    redirect("/login?callbackUrl=%2Fuser-dashboard");
  }
  return session.user;
});
