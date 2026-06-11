# 군산원예농협 쇼핑몰

군산원예농협의 농산물·가공식품을 판매하는 온라인 쇼핑몰입니다.
회원가입/로그인, 장바구니, 주문, **토스페이먼츠 결제**까지 지원합니다.

---

## 1. 실행 방법 (내 PC에서 보기)

PowerShell에서 이 폴더(`C:\AI\AA`)를 연 뒤:

```powershell
npm run dev
```

그다음 브라우저에서 **http://localhost:3000** 으로 접속하세요.

> 멈추려면 터미널에서 `Ctrl + C` 를 누르세요.

---

## 2. 테스트용 계정

| 구분 | 이메일 | 비밀번호 | 비고 |
|------|--------|----------|------|
| 일반 회원 | `test2@gunsan.test` | `test1234` | 바로 로그인 가능 |
| 관리자 | `admin@gunsan.coop` | `admin1234` | 상품 등록/삭제 가능 |

- 직접 회원가입도 가능합니다 (우측 상단 **로그인 → 회원가입**).
- 관리자로 로그인하면 우측 상단에 **관리자** 메뉴가 보이고, 상품을 등록·삭제할 수 있습니다.

---

## 3. 결제 테스트 (가짜 결제)

현재는 **토스페이먼츠 테스트 모드**입니다. 실제 돈이 빠져나가지 않습니다.

지원하는 결제수단 (일반 쇼핑몰처럼):
- 💳 **카드 · 간편결제** — 신용/체크카드, 카카오페이, 네이버페이, 토스페이 (통합 결제창)
- 🏧 **무통장입금** — 가상계좌로 현금 입금 (입금 전까지 "입금대기" 상태)
- 🏦 **실시간 계좌이체**
- 📱 **휴대폰 결제**

진행 순서:
1. 상품을 장바구니에 담고 → **주문하기** → 배송정보 입력 → **결제수단 선택** → **결제하기**
2. 토스 결제창이 열리면 테스트 모드로 결제하세요 (결제창 안내를 따르면 됩니다).
3. 결제가 끝나면 **결제완료**(무통장입금은 **입금대기**) 화면과 **주문내역**에서 확인할 수 있습니다.

> 무통장입금을 고르면 결제완료 화면에 입금할 **가상계좌 번호**가 안내됩니다.

---

## 4. 카카오 / 네이버 로그인 켜기 (선택)

지금은 **이메일 로그인만** 켜져 있습니다. 카카오·네이버 버튼은 "준비중"으로 표시됩니다.
켜려면 아래처럼 키를 발급받아 `.env` 파일에 입력하세요.

### 카카오
1. https://developers.kakao.com 접속 → 내 애플리케이션 → 애플리케이션 추가
2. **카카오 로그인** 활성화, **Redirect URI** 에 `http://localhost:3000/api/auth/callback/kakao` 등록
3. REST API 키와 보안(Client Secret)을 `.env`의 `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`에 입력

### 네이버
1. https://developers.naver.com 접속 → 애플리케이션 등록
2. **Callback URL** 에 `http://localhost:3000/api/auth/callback/naver` 등록
3. Client ID / Client Secret을 `.env`의 `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`에 입력

입력 후 서버를 다시 실행(`Ctrl+C` 후 `npm run dev`)하면 버튼이 활성화됩니다.

---

## 5. 실제 결제로 전환하기 (나중에)

실제 손님 결제를 받으려면 농협(사업자)이 토스페이먼츠에 가입·계약해야 합니다.

1. https://www.tosspayments.com 가입 및 사업자 심사
2. 발급받은 **실제 클라이언트 키 / 시크릿 키**를 `.env`의 아래 값에 교체:
   - `NEXT_PUBLIC_TOSS_CLIENT_KEY`
   - `TOSS_SECRET_KEY`
3. 서버 재시작 → 실제 결제 작동 (코드는 바꿀 필요 없음)

---

## 6. 자주 쓰는 명령어

```powershell
npm run dev        # 개발 서버 실행 (쇼핑몰 보기)
npm run db:studio  # 데이터베이스를 표로 보기 (http://localhost:5555)
npm run db:seed    # 샘플 상품/관리자 다시 넣기
npm run build      # 배포용 빌드 점검
```

---

## 기술 정보 (참고)

- **Next.js** (App Router, TypeScript) + **Tailwind CSS**
- **Prisma 7 + Supabase (PostgreSQL)** — 데이터는 Supabase 클라우드 DB에 저장
- **Auth.js (NextAuth v5)** — 이메일/카카오/네이버 로그인
- **토스페이먼츠 SDK** — 결제
- DB 연결 주소는 `.env` 의 `DATABASE_URL` / `DIRECT_URL` 에 설정합니다 (`.env.example` 참고).
