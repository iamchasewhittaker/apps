import "server-only";
import type {
  PrivacyCard,
  PrivacyPage,
  PrivacyTransaction,
} from "./types";

export const PRIVACY_BASE_URL = "https://api.privacy.com/v1";
const PAGE_SIZE = 50;

async function fetchPage<T>(
  token: string,
  path: string,
  params: Record<string, string>,
  page: number
): Promise<PrivacyPage<T>> {
  const url = new URL(PRIVACY_BASE_URL + path);
  url.searchParams.set("page", String(page));
  url.searchParams.set("page_size", String(PAGE_SIZE));
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `api-key ${token}`,
      Accept: "application/json",
    },
  });

  if (res.status === 401) throw new Error("Privacy token invalid or expired.");
  if (!res.ok) throw new Error(`Privacy API error: ${res.status}`);

  return (await res.json()) as PrivacyPage<T>;
}

async function paginate<T>(
  token: string,
  path: string,
  params: Record<string, string>
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  while (true) {
    const body = await fetchPage<T>(token, path, params, page);
    all.push(...body.data);
    if (body.data.length === 0 || page >= body.total_pages) break;
    page += 1;
  }
  return all;
}

export function createPrivacyClient(token: string) {
  if (!token) throw new Error("Privacy token is empty");

  return {
    listCards(): Promise<PrivacyCard[]> {
      return paginate<PrivacyCard>(token, "/card", {});
    },
    listTransactions(opts?: { begin?: string }): Promise<PrivacyTransaction[]> {
      const params: Record<string, string> = {};
      if (opts?.begin) params.begin = opts.begin;
      return paginate<PrivacyTransaction>(token, "/transaction", params);
    },
  };
}
