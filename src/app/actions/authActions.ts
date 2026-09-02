"use server";
import { signIn } from "@/auth";
import { LoginSchema, LoginSchemaType } from "@/lib/schemas/loginSchema";
import { registerSchema } from "@/lib/schemas/registerSchema";
import { getUserByEmail } from "@/lib/server/users";
import { prisma } from "@/prisma";
import type { ActionResult } from "@/types/domain";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { ZodIssue } from "zod";

export const registerUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<ActionResult<null>> => {
  const validated = registerSchema.safeParse({
    name,
    email,
    password,
    confirmPassword: password,
  });
  if (!validated.success)
    return { status: "error", error: validated.error.issues };
  try {
    const findExist = await getUserByEmail(validated.data.email);
    if (findExist)
      return { status: "error", error: "This email is already registered." };
    const hpass = await bcrypt.hash(validated.data.password, 10);
    await prisma.user.create({
      data: {
        email: validated.data.email,
        name: validated.data.name,
        passwordHash: hpass,
      },
    });
    return { status: "success", data: null };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { status: "error", error: "This email is already registered." };
    }
    return { status: "error", error: "Something went wrong!" };
  }
};
export const signInUser = async (
  data: LoginSchemaType,
): Promise<ActionResult<string>> => {
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    return { status: "success", data: "Logged in" };
  } catch (error) {
    if (error instanceof AuthError)
      switch (error.type) {
        case "CredentialsSignin":
          return { status: "error", error: "invalid Credential" };

        default:
          return { status: "error", error: "Something went wrong." };
      }
    else return { status: "error", error: "Something went wrong." };
  }
};
export const handleUsersLogin = async (
  _preState: ZodIssue[] | null | undefined,
  formData: FormData,
): Promise<ZodIssue[] | undefined> => {
  const action = formData.get("action");
  if (action) {
    // handle providers
    if (action !== "github") {
      return [
        {
          message: "Unsupported sign-in provider.",
          path: ["action"],
          code: "custom",
        },
      ];
    }
    await signIn("github", { redirectTo: "/members" });
  } else {
    //Handle credential Login

    const validatedData = LoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!validatedData.success) return validatedData.error.issues;
    const result = await signInUser(validatedData.data);
    if (result.status === "success") redirect("/members");
    else {
      const errors: ZodIssue[] = [
        {
          message: "Invalid username or password!",
          path: ["password"],
          code: "custom",
          fatal: true,
        },
      ];
      return errors;
    }
  }
};
