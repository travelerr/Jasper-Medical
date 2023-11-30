import type { NextAuthConfig } from "next-auth";
import { checkUserForRole } from "./app/lib/utils";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const roles = auth?.user.roles;
      const isOnDashboard =
        nextUrl.pathname.startsWith("/patient") ||
        nextUrl.pathname.startsWith("/doctor") ||
        nextUrl.pathname.startsWith("/admin");
      if (isOnDashboard) {
        if (
          roles &&
          checkUserForRole(roles, "doctor") &&
          !nextUrl.pathname.startsWith("/doctor")
        ) {
          return Response.redirect(new URL("/doctor", nextUrl));
        } else if (
          roles &&
          checkUserForRole(roles, "admin") &&
          !nextUrl.pathname.startsWith("/admin")
        ) {
          return Response.redirect(new URL("/admin", nextUrl));
        } else if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        if (roles && checkUserForRole(roles, "doctor")) {
          return Response.redirect(new URL("/doctor", nextUrl));
        } else if (roles && checkUserForRole(roles, "admin")) {
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
        token.roles = user.roles;
        token.userId = user.id;
      }
      return token;
    },
    session({ session, token }) {
      // @ts-ignore
      session.user.roles = token.roles;
      session.user.id = Number(token.userId);
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
