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
    <section
      style={{
        maxWidth: "440px",
        margin: "0 auto",
        padding: "4rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}
    >
      <div>
        <p style={{ opacity: 0.7, margin: 0 }}>회원 전용</p>
        <h1 style={{ margin: "0.5rem 0 0" }}>Login</h1>
      </div>
      <p style={{ margin: 0 }}>
        Clicking the button below sends the browser to the backend authorize endpoint. OAuth token
        exchange stays on the backend.
      </p>
      <LoginProviderFlow providers={providerOptions} />
    </section>
  );
}
