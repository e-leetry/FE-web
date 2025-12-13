"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { LoginProviderSelector, type ProviderOption } from "@/components/ui/login-provider-selector";

type LoginProviderFlowProps = {
  providers: ProviderOption[];
};

export function LoginProviderFlow({ providers }: LoginProviderFlowProps) {
  const [selected, setSelected] = useState(providers[0]);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-4 shadow-sm">
      <LoginProviderSelector providers={providers} onSelect={setSelected} />
      <Button
        type="button"
        className="w-full justify-center text-base font-semibold"
        onClick={() => {
          window.location.href = selected.authorizeUrl;
        }}
      >
        {selected.label}로 계속하기
      </Button>
    </div>
  );
}
