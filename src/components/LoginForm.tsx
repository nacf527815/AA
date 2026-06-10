"use client";

import { useActionState } from "react";
import { loginAction, type AuthFormState } from "@/actions/auth-actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    loginAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="example@email.com"
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="비밀번호"
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-green-700 py-2.5 font-semibold text-white transition hover:bg-green-800 disabled:opacity-60"
      >
        {pending ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
