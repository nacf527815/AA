import type { DefaultSession } from "next-auth";

// 세션/JWT에 우리가 추가한 id, role 필드 타입 선언
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
