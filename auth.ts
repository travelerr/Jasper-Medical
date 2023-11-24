import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import prisma from "./app/lib/prisma";
import type { User } from "@prisma/client";
import type { Adapter } from "@auth/core/adapters";

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql`SELECT * from USERS where email=${email}`;
    const user2 = await prisma.user.findFirst({
      where: { email: email },
    });
    console.log(user);
    console.log(user2);
    return user2 as User;
  } catch (error) {
    console.error("Failed to fetach user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(
            password,
            user.password as string
          );
          if (passwordsMatch) return user;
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
