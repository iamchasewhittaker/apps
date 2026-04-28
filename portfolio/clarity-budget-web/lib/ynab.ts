const BASE_URL = "https://api.ynab.com/v1";

async function getJson<T>(path: string, token: string): Promise<T> {
  const url = new URL(BASE_URL + path);
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (res.status === 401) throw new Error("Token invalid or expired.");
  if (!res.ok) throw new Error(`YNAB API error: ${res.status}`);

  return res.json() as Promise<T>;
}

async function patchJson<T>(path: string, token: string, body: unknown): Promise<T> {
  const url = new URL(BASE_URL + path);
  const res = await fetch(url.toString(), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status === 401) throw new Error("Token invalid or expired.");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`YNAB API error: ${res.status}${text ? ` — ${text.slice(0, 200)}` : ""}`);
  }

  return res.json() as Promise<T>;
}

export interface YNABMonthCategory {
  id: string;
  name: string;
  hidden: boolean;
  deleted: boolean;
  budgeted: number;
  activity: number;
  balance: number;
  goal_target: number | null;
}

export interface YNABMonth {
  month: string;
  to_be_budgeted: number | null;
  income: number | null;
  categories: YNABMonthCategory[];
}

export async function fetchMonth(token: string, budgetID: string, month: Date) {
  const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-01`;
  const json = await getJson<{ data: { month: YNABMonth } }>(
    `/budgets/${budgetID}/months/${monthStr}`,
    token
  );
  return json.data.month;
}

export async function fetchBudgets(token: string) {
  const url = new URL(BASE_URL + "/budgets");
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`YNAB API error: ${res.status}`);
  const json = (await res.json()) as {
    data: { budgets: Array<{ id: string; name: string }> };
  };
  return json.data.budgets;
}

export interface YNABCategoryGroupDTO {
  id: string;
  name: string;
  hidden: boolean;
  categories: Array<{
    id: string;
    name: string;
    hidden: boolean;
    deleted: boolean;
  }>;
}

export async function fetchCategories(token: string, budgetID: string): Promise<YNABCategoryGroupDTO[]> {
  const json = await getJson<{ data: { category_groups: YNABCategoryGroupDTO[] } }>(
    `/budgets/${budgetID}/categories`,
    token
  );
  return json.data.category_groups;
}

export interface YNABPayee {
  id: string;
  name: string;
}

export async function fetchPayees(token: string, budgetID: string): Promise<YNABPayee[]> {
  type Resp = {
    data: {
      payees: Array<{
        id: string;
        name: string;
        deleted: boolean;
        transfer_account_id: string | null;
      }>;
    };
  };
  const json = await getJson<Resp>(`/budgets/${budgetID}/payees`, token);
  return json.data.payees
    .filter((p) => !p.deleted && !p.transfer_account_id)
    .map((p) => ({ id: p.id, name: p.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export interface YNABSubTransaction {
  id: string;
  amount: number; // milliunits; negative = outflow
  memo: string | null;
  deleted: boolean;
  category_id: string | null;
  category_name: string | null;
}

export interface YNABTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number; // milliunits; negative = outflow
  memo: string | null;
  cleared: "cleared" | "uncleared" | "reconciled";
  approved: boolean;
  deleted: boolean;
  payee_id: string | null;
  payee_name: string | null;
  category_id: string | null;
  category_name: string | null;
  account_id: string;
  account_name: string;
  subtransactions: YNABSubTransaction[];
}

/**
 * Fetch all non-deleted transactions since `sinceDate` (YYYY-MM-DD).
 * Split transactions have subtransactions with per-category amounts.
 */
export async function fetchTransactions(
  token: string,
  budgetId: string,
  sinceDate: string
): Promise<YNABTransaction[]> {
  const json = await getJson<{ data: { transactions: YNABTransaction[] } }>(
    `/budgets/${budgetId}/transactions?since_date=${sinceDate}`,
    token
  );
  return json.data.transactions.filter((t) => !t.deleted);
}

/**
 * Fetch all non-deleted, uncategorized transactions for a budget.
 * Splits surface as parent rows with `category_name === "Split"`; their per-sub
 * `category_id` lives inside `subtransactions[]`.
 */
export async function fetchUncategorizedTransactions(
  token: string,
  budgetId: string
): Promise<YNABTransaction[]> {
  const json = await getJson<{ data: { transactions: YNABTransaction[] } }>(
    `/budgets/${budgetId}/transactions?type=uncategorized`,
    token
  );
  return json.data.transactions.filter((t) => !t.deleted);
}

export interface YNABUpdateSubTransaction {
  id?: string;
  amount: number;
  category_id: string | null;
  memo?: string | null;
  payee_id?: string | null;
  payee_name?: string | null;
}

export interface YNABTransactionUpdate {
  id: string;
  category_id?: string | null;
  approved?: boolean;
  memo?: string | null;
  subtransactions?: YNABUpdateSubTransaction[];
}

/**
 * Bulk-update transactions in a single PATCH call. The YNAB API accepts up to
 * the entire response of a categorization run in one request, well under the
 * 200 req / 60 min limit.
 *
 * Returns the IDs YNAB confirmed updated plus any duplicate import IDs it
 * rejected (we never send `import_id`, but the field is in the response).
 */
export async function bulkUpdateTransactions(
  token: string,
  budgetId: string,
  updates: YNABTransactionUpdate[]
): Promise<{ updated: string[]; duplicateImportIds: string[] }> {
  if (updates.length === 0) return { updated: [], duplicateImportIds: [] };

  const json = await patchJson<{
    data: {
      transaction_ids?: string[];
      duplicate_import_ids?: string[];
    };
  }>(`/budgets/${budgetId}/transactions`, token, { transactions: updates });

  return {
    updated: json.data.transaction_ids ?? [],
    duplicateImportIds: json.data.duplicate_import_ids ?? [],
  };
}
