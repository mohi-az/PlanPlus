import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      badgeId?: number;
    };
  }

  interface User extends DefaultUser {
    badgeId?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    badgeId?: number;
  }
}
