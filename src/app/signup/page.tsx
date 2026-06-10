import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignupForm from "@/components/SignupForm";

export default async function SignupPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="mb-1 text-center text-2xl font-bold text-gray-900">회원가입</h1>
      <p className="mb-8 text-center text-sm text-gray-500">
        이메일로 간편하게 가입하세요
      </p>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <SignupForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-semibold text-green-700 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
