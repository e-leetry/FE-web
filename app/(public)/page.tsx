import Link from "next/link";

import { SidebarToggle } from "@/components/ui/sidebar-toggle";

export default function HomePage() {
  return (
    <section
      style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "4rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}
    >
      <span style={{ opacity: 0.7 }}>App Router · SSR shell</span>
      <h1 style={{ fontSize: "3rem", margin: 0 }}>Reetry Frontend</h1>
      <p style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
        Minimal SSR-friendly surface that will proxy backend capabilities. Use the login page to
        initiate OAuth flows once providers are wired in.
      </p>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link
          href="/login"
          style={{
            background: "#22d3ee",
            color: "#0f172a",
            padding: "0.75rem 1.5rem",
            borderRadius: "999px",
            fontWeight: 600
          }}
        >
          Go to Login
        </Link>
        <SidebarToggle />
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
        <p style={{ margin: "0 0 0.75rem" }}>
          Public routes stay accessible without a session cookie. Middleware will redirect everything
          else to `/login`.
        </p>
        <ul>
          <li>/ — marketing/public shell</li>
          <li>/login — OAuth entry point</li>
          <li>/auth/callback/[provider] — placeholder for backend hand-off</li>
        </ul>
      </div>
    </section>
  );
}
