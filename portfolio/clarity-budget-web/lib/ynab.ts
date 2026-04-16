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
