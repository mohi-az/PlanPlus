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
  debug: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
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
    async session({ token, session }) {
      if (token.sub && session.user)
        session.user.id = token.sub;
      return session
    }
  }
})