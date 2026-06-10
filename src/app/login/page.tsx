import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "@/components/LoginForm";
import AuthButtons from "@/components/AuthButtons";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="mb-1 text-center text-2xl font-bold text-gray-900">로그인</h1>
      <p className="mb-8 text-center text-sm text-gray-500">
        군산원예농협 쇼핑몰에 오신 것을 환영합니다
      </p>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <LoginForm />

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <AuthButtons />

        <p className="mt-6 text-center text-sm text-gray-600">
          아직 회원이 아니신가요?{" "}
          <Link href="/signup" className="font-semibold text-green-700 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
