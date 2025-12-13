"use client";

import { useState } from "react";

import { LoginProviderSelector, type ProviderOption } from "@/components/ui/login-provider-selector";

type LoginProviderFlowProps = {
  providers: ProviderOption[];
};

export function LoginProviderFlow({ providers }: LoginProviderFlowProps) {
  const [selected, setSelected] = useState(providers[0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <LoginProviderSelector providers={providers} onSelect={setSelected} />
      <button
        type="button"
        onClick={() => {
          window.location.href = selected.authorizeUrl;
        }}
        style={{
          border: "none",
          borderRadius: "12px",
          padding: "0.95rem 1.5rem",
          background: "#22d3ee",
          color: "#0f172a",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: "pointer"
        }}
      >
        Continue with {selected.label}
      </button>
    </div>
  );
}
