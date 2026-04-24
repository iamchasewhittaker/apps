"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { T } from "@/lib/constants";

export function UserMenu({ email }: { email: string }) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await getSupabaseBrowserClient().auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ color: T.muted, fontSize: 12 }}>{email}</span>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          fontSize: 12,
          background: "transparent",
          color: T.muted,
          border: `1px solid ${T.border}`,
          cursor: signingOut ? "wait" : "pointer",
        }}
      >
        {signingOut ? "…" : "Sign out"}
      </button>
    </div>
  );
}
