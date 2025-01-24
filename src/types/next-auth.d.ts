import type { DefaultSession } from "next-auth";

declare module 'next-auth' {
  interface Session extends DefaultSession{
    BadgeId?: number;
  }
}
declare module 'next-auth' {
  interface User extends DefaultUser{
    BadgeId?: number;
  }
}
