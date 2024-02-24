import type { NextAuthConfig } from "next-auth";
import { UserRole } from "@/app/_lib/definitions";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user.role;
      const isOnDashboard =
        nextUrl.pathname.startsWith("/patient") ||
        nextUrl.pathname.startsWith("/doctor") ||
        nextUrl.pathname.startsWith("/admin");
      if (isOnDashboard) {
        if (
          role &&
          role === UserRole.DOCTOR &&
          !nextUrl.pathname.startsWith("/doctor")
        ) {
          return Response.redirect(new URL("/doctor", nextUrl));
        } else if (
          role &&
          role === UserRole.ADMIN &&
          !nextUrl.pathname.startsWith("/admin")
        ) {
          return Response.redirect(new URL("/admin", nextUrl));
        } else if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        if (role && role === UserRole.DOCTOR) {
          return Response.redirect(new URL("/doctor", nextUrl));
        } else if (role && role === UserRole.ADMIN) {
          return Response.redirect(new URL("/admin", nextUrl));
        } else {
          return Response.redirect(new URL("/patient", nextUrl));
        }
      }
      return true;
    },
    jwt({ user, token }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    session({ session, token }) {
      // @ts-ignore
      session.user.role = token.role;
      session.user.id = Number(token.userId);
      return session;
    },
  },
  // @ts-ignore
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
