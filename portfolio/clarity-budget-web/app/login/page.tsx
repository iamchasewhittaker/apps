"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { T } from "@/lib/constants";

type Status = "idle" | "signing-in" | "error";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const canSubmit = email.trim().length > 0 && password.length > 0 && status !== "signing-in";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("signing-in");
    setError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInErr) {
        setError(signInErr.message);
        setStatus("error");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: 32,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Clarity Budget</h1>
        <p style={{ color: T.muted, marginTop: 4, marginBottom: 24, fontSize: 14 }}>
          Safe to spend, from YNAB.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            style={{ display: "block", fontSize: 13, color: T.muted, marginBottom: 6 }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px",
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 6,
              color: T.text,
              fontSize: 14,
              outline: "none",
            }}
          />

          <label
            htmlFor="password"
            style={{ display: "block", fontSize: 13, color: T.muted, marginTop: 14, marginBottom: 6 }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px",
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 6,
              color: T.text,
              fontSize: 14,
              outline: "none",
            }}
          />

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "10px 14px",
              background: T.accent,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 500,
              cursor: status === "signing-in" ? "wait" : canSubmit ? "pointer" : "not-allowed",
              opacity: canSubmit ? 1 : 0.6,
            }}
          >
            {status === "signing-in" ? "Signing in…" : "Sign in"}
          </button>
          {error && (
            <div style={{ marginTop: 12, color: T.danger, fontSize: 13 }}>{error}</div>
          )}
        </form>
      </div>
    </div>
  );
}
