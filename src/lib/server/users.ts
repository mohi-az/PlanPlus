import "server-only";

import { prisma } from "@/prisma";

export const getUserByEmail = (email: string) =>
  prisma.user.findFirst({
    where: { email: { equals: email.trim(), mode: "insensitive" } },
  });
