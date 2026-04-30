"use client";

import { useEffect, useState } from "react";

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

  const sectionClass = "mb-5 rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-5";

  if (cardsState === "loading" || payeesState === "loading") {
    return (
      <section className={sectionClass}>
        <h2 className="text-base font-semibold text-white">
          Card → payee mapping
        </h2>
        <p className="mt-2.5 text-sm text-muted">
          Loading…
        </p>
      </section>
    );
  }

  if (cardsState === "error" || payeesState === "error") {
    return (
      <section className={sectionClass}>
        <h2 className="text-base font-semibold text-white">
          Card → payee mapping
        </h2>
        {cardsError && (
          <p className="mt-2.5 text-sm text-danger">
            Cards: {cardsError}
          </p>
        )}
        {payeesError && (
          <p className="mt-1.5 text-sm text-danger">
            Payees: {payeesError}
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            void loadCards();
            void loadPayees();
          }}
          className="mt-3 rounded-md border border-dimmer bg-transparent px-3 py-1.5 text-sm text-white cursor-pointer"
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className={sectionClass}>
      <h2 className="text-base font-semibold text-white">
        Card → payee mapping
      </h2>
      <p className="mt-1 mb-4 text-sm text-muted">
        Link each Privacy.com card to its corresponding YNAB payee so reconcile
        can match transactions automatically.
      </p>

      {cards.length === 0 ? (
        <p className="text-sm text-muted">
          No cards synced yet — they&apos;ll appear after the next sync runs.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {cards.map((card) => {
            const err = rowError[card.token];
            const saving = savingToken === card.token;
            return (
              <li
                key={card.token}
                className="flex flex-col gap-1.5 rounded-lg border border-dimmer bg-bg p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-white">
                      {card.memo ?? "Unnamed card"}
                    </span>
                    <span className="text-xs text-muted">
                      {[card.state, card.type].filter(Boolean).join(" · ") || "—"}
                    </span>
                  </div>
                  <select
                    value={card.linked_payee_id ?? ""}
                    onChange={(e) => void handleChange(card.token, e.target.value)}
                    disabled={saving}
                    className={`min-w-[220px] rounded-md border border-dimmer bg-surface px-2.5 py-1.5 text-sm text-white ${
                      saving ? "cursor-wait" : "cursor-pointer"
                    }`}
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
                  <span className="text-xs text-danger">{err}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
