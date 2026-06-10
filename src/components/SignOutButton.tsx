import { signOut } from "@/auth";

// 로그아웃 버튼 (서버 액션 사용)
export default function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="text-sm text-gray-600 transition hover:text-gray-900"
      >
        로그아웃
      </button>
    </form>
  );
}
