/** @jsxImportSource react */
"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarToggle } from "@/components/ui/sidebar-toggle";

export default function HomePage() {
  const [payload, setPayload] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!payload.trim()) return;

    try {
      setStatus("loading");
      await fetch("https://example.com/api/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload })
      });
      setStatus("success");
      setPayload("");
    } catch (error) {
      console.error("Mock POST failed", error);
      setStatus("error");
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-16 text-slate-100">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-slate-400">App Router · SSR shell</span>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-50">Reetry Frontend</h1>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button asChild className="text-base font-semibold">
          <Link href="/login">로그인 화면으로 이동</Link>
        </Button>
        <SidebarToggle />
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-4 shadow-sm">
        <p className="text-sm text-slate-300">
          Public routes stay accessible without a session cookie. Middleware will redirect everything else to
          <code className="ml-1 font-mono text-slate-200">/login</code>.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-400">
          <li>/ — marketing/public shell</li>
          <li>/login — OAuth entry point</li>
          <li>/auth/callback/[provider] — placeholder for backend hand-off</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-4 shadow-sm">
        <div className="flex flex-col gap-2">
          <Label htmlFor="address-input" className="text-slate-200">
            주소를 입력해주세요
          </Label>
          <Input
            id="address-input"
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
            placeholder="Type any text…"
            aria-describedby="mock-request-hint"
          />
          <p id="mock-request-hint" className="text-xs text-slate-500">
            입력한 값이 그대로 모의 POST 요청 payload로 전송됩니다.
          </p>
        </div>
        <Button type="submit" disabled={!payload.trim() || status === "loading"} className="w-full justify-center text-base font-semibold">
          {status === "loading" ? "요청 전송 중..." : "모의 요청 보내기"}
        </Button>
        {status === "success" && <span className="text-sm font-medium text-emerald-300">요청에 성공했습니다.</span>}
        {status === "error" && <span className="text-sm font-medium text-rose-300">요청에 실패했습니다.</span>}
      </form>
    </section>
  );
}
