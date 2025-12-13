import type { Metadata } from "next";

import { LoginProviderFlow } from "@/components/login/login-provider-flow";
import { buildAuthorizeUrl, oauthProviders } from "@/lib/auth/routes";

export const metadata: Metadata = {
  title: "로그인"
};

const providerOptions = oauthProviders.map((provider) => ({
  id: provider,
  label: provider === "kakao" ? "Kakao" : provider[0].toUpperCase() + provider.slice(1),
  description: `${provider} OAuth provider`,
  authorizeUrl: buildAuthorizeUrl(provider)
}));

export default function LoginPage() {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-4 px-6 py-16 text-slate-100">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-slate-400">회원 전용</p>
        <h1 className="text-4xl font-semibold text-slate-50">Login</h1>
      </div>
      <p className="text-base text-slate-300">
        아래 버튼을 누르면 백엔드 OAuth 인가 엔드포인트로 이동합니다. 토큰 교환은 백엔드에서 안전하게 처리됩니다.
      </p>
      <LoginProviderFlow providers={providerOptions} />
    </section>
  );
}
