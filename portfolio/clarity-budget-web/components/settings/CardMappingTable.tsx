"use client";

import { useEffect, useState } from "react";
import { T } from "@/lib/constants";

type Card = {
  token: string;
  memo: string | null;
  state: string | null;
  type: string | null;
  linked_payee_id: string | null;
};

type Payee = { id: string; name: string };

type LoadState = "loading" | "ready" | "error";

export function CardMappingTable() {
  const [cards, setCards] = useState<Card[]>([]);
  const [payees, setPayees] = useState<Payee[]>([]);
  const [cardsState, setCardsState] = useState<LoadState>("loading");
  const [payeesState, setPayeesState] = useState<LoadState>("loading");
  const [cardsError, setCardsError] = useState("");
  const [payeesError, setPayeesError] = useState("");
  const [savingToken, setSavingToken] = useState<string | null>(null);
  const [rowError, setRowError] = useState<Record<string, string>>({});

  async function loadCards() {
    setCardsState("loading");
    setCardsError("");
    try {
      const res = await fetch("/api/settings/cards", { cache: "no-store" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const json = (await res.json()) as { cards: Card[] };
      setCards(json.cards);
      setCardsState("ready");
    } catch (err) {
      setCardsError(err instanceof Error ? err.message : "load failed");
      setCardsState("error");
    }
  }

  async function loadPayees() {
    setPayeesState("loading");
    setPayeesError("");
    try {
      const res = await fetch("/api/ynab/payees", { cache: "no-store" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const json = (await res.json()) as { payees: Payee[] };
      setPayees(json.payees);
      setPayeesState("ready");
    } catch (err) {
      setPayeesError(err instanceof Error ? err.message : "load failed");
      setPayeesState("error");
    }
  }

  useEffect(() => {
    void loadCards();
    void loadPayees();
  }, []);

  async function handleChange(token: string, payeeId: string) {
    const next = payeeId === "" ? null : payeeId;
    const prev = cards.find((c) => c.token === token)?.linked_payee_id ?? null;

    setCards((cs) =>
      cs.map((c) => (c.token === token ? { ...c, linked_payee_id: next } : c))
    );
    setSavingToken(token);
    setRowError((m) => {
      const next = { ...m };
      delete next[token];
      return next;
    });

    try {
      const res = await fetch(
        `/api/settings/cards/${encodeURIComponent(token)}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ linked_payee_id: next }),
        }
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
    } catch (err) {
      setCards((cs) =>
        cs.map((c) =>
          c.token === token ? { ...c, linked_payee_id: prev } : c
        )
      );
      setRowError((m) => ({
        ...m,
        [token]: err instanceof Error ? err.message : "save failed",
      }));
    } finally {
      setSavingToken((t) => (t === token ? null : t));
    }
  }

  const sectionStyle: React.CSSProperties = {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  };

  if (cardsState === "loading" || payeesState === "loading") {
    return (
      <section style={sectionStyle}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: T.text }}>
          Card → payee mapping
        </h2>
        <p style={{ margin: "10px 0 0", fontSize: 13, color: T.muted }}>
          Loading…
        </p>
      </section>
    );
  }

  if (cardsState === "error" || payeesState === "error") {
    return (
      <section style={sectionStyle}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: T.text }}>
          Card → payee mapping
        </h2>
        {cardsError && (
          <p style={{ margin: "10px 0 0", fontSize: 13, color: T.danger }}>
            Cards: {cardsError}
          </p>
        )}
        {payeesError && (
          <p style={{ margin: "6px 0 0", fontSize: 13, color: T.danger }}>
            Payees: {payeesError}
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            void loadCards();
            void loadPayees();
          }}
          style={{
            marginTop: 12,
            padding: "6px 12px",
            borderRadius: 6,
            border: `1px solid ${T.border}`,
            background: "transparent",
            color: T.text,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section style={sectionStyle}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: T.text }}>
        Card → payee mapping
      </h2>
      <p style={{ margin: "4px 0 16px", fontSize: 13, color: T.muted }}>
        Link each Privacy.com card to its corresponding YNAB payee so reconcile
        can match transactions automatically.
      </p>

      {cards.length === 0 ? (
        <p style={{ margin: 0, fontSize: 13, color: T.muted }}>
          No cards synced yet — they&apos;ll appear after the next sync runs.
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {cards.map((card) => {
            const err = rowError[card.token];
            const saving = savingToken === card.token;
            return (
              <li
                key={card.token}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  background: T.bg,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 14, color: T.text, fontWeight: 500 }}>
                      {card.memo ?? "Unnamed card"}
                    </span>
                    <span style={{ fontSize: 12, color: T.muted }}>
                      {[card.state, card.type].filter(Boolean).join(" · ") || "—"}
                    </span>
                  </div>
                  <select
                    value={card.linked_payee_id ?? ""}
                    onChange={(e) => void handleChange(card.token, e.target.value)}
                    disabled={saving}
                    style={{
                      minWidth: 220,
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: `1px solid ${T.border}`,
                      background: T.surface,
                      color: T.text,
                      fontSize: 13,
                      cursor: saving ? "wait" : "pointer",
                    }}
                  >
                    <option value="">— unlinked —</option>
                    {payees.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                {err && (
                  <span style={{ fontSize: 12, color: T.danger }}>{err}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
