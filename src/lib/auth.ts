import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { backendAuthRequest } from "./backend-auth";
import { getAccountProfile } from "./backend-profile";

export function createAuthOptions(): NextAuthOptions {
  return {
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const email = credentials?.email?.trim();
          const password = credentials?.password;
          if (!email || !password) {
            throw new Error("Please enter your email and password");
          }

          const { user, accessToken } = await backendAuthRequest("/auth/login", {
            email,
            password,
          });
          return {
            id: user._id,
            email: user.email,
            name: user.fullName,
            backendUser: {
              id: user._id,
              fullName: user.fullName,
              email: user.email,
              emailVerified: user.emailVerified,
              role: user.role,
              phoneNumber: user.phoneNumber ?? undefined,
              status: user.status,
              referralCode: user.referralCode ?? undefined,
              accessToken,
            },
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user, trigger, session }) {
        if (user) token.backendUser = user.backendUser;

        const backendUser = token.backendUser;
        if (trigger === "update" && session?.refreshProfile === true && backendUser) {
          try {
            const profile = await getAccountProfile(backendUser.accessToken);
            if (profile.id === backendUser.id) {
              token.backendUser = {
                ...backendUser,
                fullName: profile.fullName,
                phoneNumber: profile.phoneNumber || undefined,
              };
            }
          } catch {
            // Keep the session usable when the profile API is unavailable.
          }
        }

        return token;
      },
      async session({ session, token }) {
        if (token.backendUser) {
          session.user = { ...token.backendUser, name: token.backendUser.fullName };
        } else {
          delete session.user;
        }
        return session;
      },
    },
    pages: { signIn: "/login", error: "/login" },
  };
}
