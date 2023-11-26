import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Role {
    id: number;
    name: string;
    userId: number;
  }

  interface Session {
    user: {
      roles: Array<Role>;
    };
  }
}

declare module "next-auth/jwt" {
  interface Role {
    id: number;
    name: string;
    userId: number;
  }

  interface JWT {
    role: Array<Role>;
  }
}
