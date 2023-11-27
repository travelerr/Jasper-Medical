import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "./app/lib/prisma";
import type { User } from "@prisma/client";

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await prisma.user.findFirst({
      where: { email: email },
      include: {
        roles: {
          include: {
            role: true, // Include the Role model to get the role names
          },
        },
      },
    });
    return user as User;
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
        console.error("Invalid credentials");
        return null;
      },
    }),
  ],
});
