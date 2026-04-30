"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { LogoLockup } from "@/components/LogoIcon";

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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-bg">
      <div className="mb-10">
        <LogoLockup variant="stacked" markSize={72} />
      </div>

      <div className="w-full max-w-[400px] bg-surface border border-dimmer rounded-2xl p-8">
        <button
          type="button"
          onClick={handleGitHub}
          disabled={oauthBusy || status === "signing-in"}
          className="w-full py-3 bg-bg border border-dimmer rounded-lg flex items-center justify-center gap-2.5 text-white text-sm font-medium transition-opacity disabled:opacity-50 hover:border-steel/60"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          {oauthBusy ? "Redirecting…" : "Continue with GitHub"}
        </button>

        <div className="flex items-center gap-3 my-5 text-steel/50 text-xs">
          <div className="flex-1 h-px bg-dimmer" />
          <span>or</span>
          <div className="flex-1 h-px bg-dimmer" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs text-steel mb-1.5">
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
              className="bg-bg border border-dimmer text-white text-sm rounded-md px-3 py-2.5 w-full outline-none focus:border-green/50 transition-colors placeholder:text-steel/40"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs text-steel mb-1.5">
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
              className="bg-bg border border-dimmer text-white text-sm rounded-md px-3 py-2.5 w-full outline-none focus:border-green/50 transition-colors placeholder:text-steel/40"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="bg-green text-bg font-semibold py-3 rounded-lg w-full text-sm transition-opacity disabled:opacity-50"
          >
            {status === "signing-in" ? "Signing in…" : "Sign in"}
          </button>

          {error && (
            <p className="text-danger text-xs mt-2">{error}</p>
          )}
        </form>

        <p className="font-mono-label text-[9px] text-steel/50 mt-6 text-center">
          Backed by YNAB · Encrypted · Private
        </p>
      </div>
    </div>
  );
}
