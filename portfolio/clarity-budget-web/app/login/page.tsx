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
  const [oauthBusy, setOauthBusy] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    email.trim().length > 0 &&
    password.length > 0 &&
    status !== "signing-in" &&
    !oauthBusy;

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

  async function handleGitHub() {
    if (oauthBusy || status === "signing-in") return;
    setOauthBusy(true);
    setError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });
      if (oauthErr) {
        setError(oauthErr.message);
        setOauthBusy(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setOauthBusy(false);
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

        <button
          type="button"
          onClick={handleGitHub}
          disabled={oauthBusy || status === "signing-in"}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "10px 14px",
            background: T.bg,
            color: T.text,
            border: `1px solid ${T.border}`,
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            cursor: oauthBusy ? "wait" : status === "signing-in" ? "not-allowed" : "pointer",
            opacity: oauthBusy || status === "signing-in" ? 0.6 : 1,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          {oauthBusy ? "Redirecting…" : "Continue with GitHub"}
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "20px 0",
            color: T.muted,
            fontSize: 12,
          }}
        >
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <span>or</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>

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
