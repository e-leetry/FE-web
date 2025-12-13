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
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-16 text-slate-100">
      <h1 className="text-3xl font-semibold text-slate-50">OAuth callback</h1>
      <p className="text-base text-slate-300">
        Provider: <strong className="font-semibold text-slate-100">{params.provider}</strong>
      </p>
      <p className="text-sm text-slate-400">
        This route should receive the backend redirect once the OAuth provider sends temporary auth code/state. Hand the
        query params back to the backend over the fetcher.
      </p>
      <pre className="rounded-lg border border-slate-800 bg-slate-950/60 overflow-x-auto px-4 py-4 text-sm text-slate-200 shadow-sm">
        {JSON.stringify(searchParams, null, 2)}
      </pre>
    </section>
  );
}
