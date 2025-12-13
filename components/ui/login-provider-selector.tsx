"use client";

import { RadioGroup } from "@headlessui/react";
import { useState } from "react";

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
      onChange={(value) => {
        setSelected(value);
        onSelect(value);
      }}
      className="provider-selector"
    >
      {providers.map((provider) => (
        <RadioGroup.Option key={provider.id} value={provider}>
          {({ checked }) => (
            <div
              style={{
                border: checked ? "2px solid #22d3ee" : "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "0.75rem",
                cursor: "pointer",
                background: checked ? "rgba(34, 211, 238, 0.12)" : "rgba(15,23,42,0.7)"
              }}
            >
              <div style={{ fontWeight: 600 }}>{provider.label}</div>
              <p style={{ fontSize: "0.875rem", margin: "0.25rem 0 0" }}>{provider.description}</p>
            </div>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
}
