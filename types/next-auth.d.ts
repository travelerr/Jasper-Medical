import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Role {
    userId: number;
    roleId: number;
    role: {
      id: number;
      name: string;
    };
  }

  interface Session {
    user: {
      id: number;
      role: string;
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
    userId: number;
  }
}
