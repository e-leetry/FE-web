"use client";

import { RadioGroup } from "@headlessui/react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { OAuthProvider } from "@/lib/auth/routes";

export type ProviderOption = {
  id: OAuthProvider;
  label: string;
  description: string;
  authorizeUrl: string;
};

type LoginProviderSelectorProps = {
  providers: ProviderOption[];
  onSelect: (provider: ProviderOption) => void;
};

export function LoginProviderSelector({ providers, onSelect }: LoginProviderSelectorProps) {
  const [selected, setSelected] = useState(providers[0]);

  return (
    <RadioGroup
      value={selected}
      aria-label="OAuth 제공자 선택"
      onChange={(value) => {
        setSelected(value);
        onSelect(value);
      }}
      className="flex flex-col gap-4"
    >
      {providers.map((provider) => (
        <RadioGroup.Option
          key={provider.id}
          value={provider}
          className={({ checked }) =>
            cn(
              "rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
              checked && "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
            )
          }
        >
          {({ checked }) => (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-slate-900">{provider.label}</p>
                <span
                  className={cn(
                    "text-xs font-medium uppercase tracking-wide text-slate-500",
                    checked && "text-slate-900"
                  )}
                >
                  {checked ? "선택됨" : "선택"}
                </span>
              </div>
              <p className="text-sm text-slate-500">{provider.description}</p>
            </div>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
}
