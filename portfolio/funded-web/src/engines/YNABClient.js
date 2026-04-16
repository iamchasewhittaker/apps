// YNABClient.js — YNAB API client (browser fetch)
// YNAB API supports CORS, so we can call directly from the browser.

const BASE_URL = "https://api.ynab.com/v1";

async function request(path, token, queryParams = {}) {
  const url = new URL(BASE_URL + path);
  for (const [k, v] of Object.entries(queryParams)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (res.status === 401) throw new Error("Token invalid or expired.");
  if (!res.ok) throw new Error(`YNAB API error: ${res.status}`);

  return res.json();
}

async function patchRequest(path, token, body) {
  const url = new URL(BASE_URL + path);
  const res = await fetch(url.toString(), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status === 401) throw new Error("Token invalid or expired.");
  if (!res.ok) throw new Error(`YNAB API error: ${res.status}`);
}

export async function fetchBudgets(token) {
  const json = await request("/budgets", token);
  return json.data.budgets;
}

export async function fetchCategories(token, budgetID) {
  const json = await request(`/budgets/${budgetID}/categories`, token);
  return json.data.category_groups;
}

export async function fetchMonth(token, budgetID, month) {
  const d = month instanceof Date ? month : new Date(month);
  const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  const json = await request(`/budgets/${budgetID}/months/${monthStr}`, token);
  return json.data.month;
}

export async function fetchTransactions(token, budgetID, sinceDate) {
  const d = sinceDate instanceof Date ? sinceDate : new Date(sinceDate);
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const json = await request(`/budgets/${budgetID}/transactions`, token, { since_date: dateStr });
  return json.data.transactions.filter(t => !t.deleted);
}

export async function fetchBudgetDetail(token, budgetID) {
  const json = await request(`/budgets/${budgetID}`, token);
  return json.data.budget;
}

export async function updateCategoryBudgeted(token, budgetID, month, categoryID, budgetedMilliunits) {
  const d = month instanceof Date ? month : new Date(month);
  const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  await patchRequest(`/budgets/${budgetID}/months/${monthStr}/categories/${categoryID}`, token, {
    category: { budgeted: budgetedMilliunits },
  });
}

export async function updateTransactionCategory(token, budgetID, transactionID, categoryID, memo) {
  const row = { id: transactionID, category_id: categoryID };
  if (memo != null && String(memo).trim()) {
    row.memo = String(memo).trim();
  }
  await patchRequest(`/budgets/${budgetID}/transactions`, token, {
    transactions: [row],
  });
}
