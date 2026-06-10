import { enabledSocial } from "@/auth";
import { kakaoLoginAction, naverLoginAction } from "@/actions/auth-actions";

// 카카오/네이버 소셜 로그인 버튼.
// 환경변수에 키가 없으면 비활성 안내를 함께 보여준다.
export default function AuthButtons() {
  return (
    <div className="flex flex-col gap-3">
      {enabledSocial.kakao ? (
        <form action={kakaoLoginAction}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] py-2.5 font-semibold text-[#191600] transition hover:brightness-95"
          >
            카카오로 시작하기
          </button>
        </form>
      ) : (
        <button
          type="button"
          disabled
          title="관리자가 카카오 로그인 키를 등록하면 사용할 수 있습니다"
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-[#FEE500]/50 py-2.5 font-semibold text-[#191600]/60"
        >
          카카오로 시작하기 (준비중)
        </button>
      )}

      {enabledSocial.naver ? (
        <form action={naverLoginAction}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#03C75A] py-2.5 font-semibold text-white transition hover:brightness-95"
          >
            네이버로 시작하기
          </button>
        </form>
      ) : (
        <button
          type="button"
          disabled
          title="관리자가 네이버 로그인 키를 등록하면 사용할 수 있습니다"
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-[#03C75A]/50 py-2.5 font-semibold text-white/70"
        >
          네이버로 시작하기 (준비중)
        </button>
      )}
    </div>
  );
}
