import type { DefaultSession } from "next-auth";

interface BackendSessionUser {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  role: string;
  phoneNumber?: string;
  status: string;
  referralCode?: string;
  accessToken: string;
}

declare module "next-auth" {
  interface Session {
    user?: BackendSessionUser & DefaultSession["user"];
  }

  interface User {
    backendUser: BackendSessionUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendUser?: BackendSessionUser;
  }
}
