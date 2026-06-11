# 인터넷에 배포하기 (도메인 연결)

이 쇼핑몰을 실제 인터넷 주소로 띄우는 방법입니다.
데이터베이스는 이미 **Supabase 클라우드**에 있으므로, **Vercel**(넥스트js 공식 호스팅)에 코드만 올리면 됩니다. 무료로 시작할 수 있습니다.

---

## 1단계. Vercel에 가입하고 저장소 연결

1. https://vercel.com 접속 → **Sign Up** → **Continue with GitHub** (깃허브 계정으로 가입)
2. **Add New… → Project** 클릭
3. 깃허브 저장소 목록에서 **`nacf527815/AA`** 선택 → **Import**
4. **환경변수(Environment Variables)** 입력 (아래 2단계 참고)
5. **Deploy** 클릭 → 1~2분 후 `https://aa-xxxx.vercel.app` 주소가 생깁니다.

> 이후에는 코드를 `git push` 할 때마다 **자동으로 다시 배포**됩니다.

---

## 2단계. 환경변수 입력 (중요)

Vercel의 **Settings → Environment Variables** 에 아래 값들을 넣습니다.
(`.env` 파일 내용과 같되, 주소 관련 2개는 실제 배포 주소로 바꿉니다.)

| 이름 | 값 |
|------|-----|
| `DATABASE_URL` | (.env의 Supabase 6543 주소 그대로) |
| `DIRECT_URL` | (.env의 Supabase 5432 주소 그대로) |
| `AUTH_SECRET` | (.env의 값 그대로) |
| `AUTH_URL` | **배포 주소** (예: `https://내도메인.com`) |
| `NEXT_PUBLIC_BASE_URL` | **배포 주소** (예: `https://내도메인.com`) |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | (.env의 값) |
| `TOSS_SECRET_KEY` | (.env의 값) |
| `KAKAO_CLIENT_ID` / `KAKAO_CLIENT_SECRET` | (쓸 경우) |
| `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET` | (쓸 경우) |

> 처음엔 도메인이 없으니 `AUTH_URL`/`NEXT_PUBLIC_BASE_URL`에 Vercel이 준 `https://aa-xxxx.vercel.app` 주소를 넣고, 나중에 도메인 연결 후 도메인 주소로 바꾸면 됩니다.

---

## 3단계. 내 도메인 연결 (선택)

1. **도메인 구입**: 가비아(gabia.com), 후이즈(whois.co.kr), Cloudflare, Namecheap 등에서 원하는 주소를 구입합니다. (보통 연 1~2만원대)
2. Vercel 프로젝트 → **Settings → Domains** → 구입한 도메인 입력 → **Add**
3. Vercel이 알려주는 **DNS 설정값**(A 레코드 또는 CNAME)을 도메인 구입처 관리페이지에 입력합니다.
4. 몇 분~몇 시간 뒤 연결되며, **HTTPS(자물쇠)** 도 자동 적용됩니다.
5. 연결 후 2단계의 `AUTH_URL`/`NEXT_PUBLIC_BASE_URL`을 도메인 주소로 바꾸고 재배포합니다.

---

## 4단계. 배포 후 마무리 설정

- **카카오/네이버 로그인**: 개발자 콘솔의 Redirect URI에 배포 주소를 추가
  - 카카오: `https://내도메인.com/api/auth/callback/kakao`
  - 네이버: `https://내도메인.com/api/auth/callback/naver`
- **토스페이먼츠 실결제**: 테스트 키 → 실제 키로 교체 (사업자 계약 후)
- **Supabase**: 이미 클라우드라 추가 작업 없음. (무료 플랜은 일정 기간 미사용 시 일시정지될 수 있으니, 운영 시 유료 플랜 권장)

---

## 요약

```
GitHub(코드) ──자동배포──▶ Vercel(웹사이트) ──연결──▶ Supabase(데이터)
                              ▲
                          내 도메인.com
```

가장 빠른 길: **Vercel 가입 → 저장소 Import → 환경변수 입력 → Deploy** → 바로 `.vercel.app` 주소로 접속 가능. 도메인은 나중에 붙여도 됩니다.
