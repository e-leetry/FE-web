import type { Metadata } from "next";

import type { OAuthProvider } from "@/lib/auth/routes";

type CallbackPageProps = {
  params: { provider: OAuthProvider };
  searchParams: Record<string, string | string[] | undefined>;
};

export function generateMetadata({ params }: CallbackPageProps): Metadata {
  return {
    title: `Callback · ${params.provider}`
  };
}

export default function CallbackPage({ params, searchParams }: CallbackPageProps) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "4rem 1.5rem",
        maxWidth: "720px",
        margin: "0 auto"
      }}
    >
      <h1>OAuth callback</h1>
      <p>
        Provider: <strong>{params.provider}</strong>
      </p>
      <p>
        This route should receive the backend redirect once the OAuth provider sends temporary auth
        code/state. Hand the query params back to the backend over the fetcher.
      </p>
      <pre
        style={{
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.15)",
          padding: "1rem",
          overflowX: "auto",
          fontSize: "0.85rem"
        }}
      >
        {JSON.stringify(searchParams, null, 2)}
      </pre>
    </section>
  );
}
