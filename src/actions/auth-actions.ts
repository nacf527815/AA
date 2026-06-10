"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";

export type AuthFormState = { error?: string } | undefined;

const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const SignupSchema = z.object({
  name: z.string().min(1, "이름을 입력하세요"),
  email: z
    .string()
    .min(1, "이메일을 입력하세요")
    .refine((v) => emailRegex.test(v), "올바른 이메일 형식이 아닙니다"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
});

// 회원가입 → 성공 시 자동 로그인 후 홈으로 이동
export async function signupAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인하세요" };
  }

  const name = parsed.data.name.trim();
  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return { error: "이미 가입된 이메일입니다" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, passwordHash } });

  // 가입 직후 자동 로그인 (signIn은 성공 시 redirect 예외를 던지므로 밖에서 호출)
  await signIn("credentials", { email, password, redirectTo: "/" });
  return undefined;
}

// 이메일/비밀번호 로그인
export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력하세요" };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "이메일 또는 비밀번호가 올바르지 않습니다" };
    }
    throw error; // redirect 예외 등은 그대로 전달
  }
  return undefined;
}

// 소셜 로그인 (카카오/네이버) — 폼 action으로 사용
export async function kakaoLoginAction() {
  await signIn("kakao", { redirectTo: "/" });
}

export async function naverLoginAction() {
  await signIn("naver", { redirectTo: "/" });
}
