"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { T } from "@/lib/constants";

type Status = "idle" | "sending" | "sent" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (otpErr) {
        setError(otpErr.message);
        setStatus("error");
        return;
      }
      setStatus("sent");
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

        {status === "sent" ? (
          <div>
            <div style={{ fontSize: 16, marginBottom: 8 }}>Check your email</div>
            <div style={{ color: T.muted, fontSize: 14, lineHeight: 1.5 }}>
              We sent a magic link to <strong style={{ color: T.text }}>{email}</strong>. Click it
              to sign in.
            </div>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setEmail("");
              }}
              style={{
                marginTop: 20,
                background: "transparent",
                border: `1px solid ${T.border}`,
                color: T.muted,
                padding: "8px 14px",
                borderRadius: 6,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Use a different email
            </button>
          </div>
        ) : (
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
            <button
              type="submit"
              disabled={status === "sending" || !email.trim()}
              style={{
                marginTop: 16,
                width: "100%",
                padding: "10px 14px",
                background: T.accent,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                cursor: status === "sending" ? "wait" : "pointer",
                opacity: status === "sending" || !email.trim() ? 0.6 : 1,
              }}
            >
              {status === "sending" ? "Sending…" : "Send magic link"}
            </button>
            {error && (
              <div style={{ marginTop: 12, color: T.danger, fontSize: 13 }}>{error}</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
