import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { GetUserByEmail } from "./app/actions/authActions"
import bcrypt from "bcryptjs";
import { LoginSchema } from "./lib/schemas/loginSchema"
import GitHub from "next-auth/providers/github"

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
        console.log("Starting authorization...");
        const validated = LoginSchema.safeParse(credentials)
        if (validated.success) {
          const user = await GetUserByEmail(validated.data.email)
          if (!user || !user.passwordHash || !bcrypt.compareSync(validated.data.password, user.passwordHash)) {
            console.log("there is a Error ....")
            return null
          }
          else
            return user
        }
        else return null
      },
    }),
    GitHub(
      {
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
        checks: ['pkce', 'state'],
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      }
    ),

  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.email },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.BadgeId = dbUser.BadgeId;
        }
      }
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user){
        session.user.id = token.sub;
        session.user.BadgeId = parseInt(token.BadgeId as string);
      }
      return session
    }

  }
}
)