import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { getUserByEmail } from "./lib/server/users";
import bcrypt from "bcryptjs";
import { LoginSchema } from "./lib/schemas/loginSchema";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validated = LoginSchema.safeParse(credentials);
        if (validated.success) {
          const user = await getUserByEmail(validated.data.email);
          if (!user || !user.passwordHash) return null;
          const match = await bcrypt.compare(
            validated.data.password,
            user.passwordHash,
          );
          if (!match) return null;
          return user;
        } else return null;
      },
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      // Use state check for CSRF protection. PKCE is optional and
      // should only be enabled if the GitHub OAuth app and provider
      // configuration explicitly support it.
      checks: ["state"],
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (dbUser) {
          token.sub = dbUser.id;
          token.badgeId = dbUser.BadgeId;
        }
      }
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.badgeId =
          typeof token.badgeId === "number" ? token.badgeId : undefined;
      }
      return session;
    },
  },
});
