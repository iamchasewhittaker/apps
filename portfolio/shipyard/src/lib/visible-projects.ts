export const VISIBLE_KEY = 'shipyard_visible_projects';
export const VISIBLE_OPEN_EVENT = 'shipyard:open-picker';
export const VISIBLE_CHANGE_EVENT = 'shipyard:visible-change';

export function parseSlugList(raw: string | null | undefined): string[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const slugs = parsed.filter((x): x is string => typeof x === 'string');
    return slugs.length ? slugs : null;
  } catch {
    return null;
  }
}

export function filterByVisible<T extends { slug: string }>(
  rows: T[],
  set: Set<string> | null,
): T[] {
  if (!set || set.size === 0) return rows;
  return rows.filter((r) => set.has(r.slug));
}

export function readVisibleSet(): string[] | null {
  if (typeof window === 'undefined') return null;
  return parseSlugList(window.localStorage.getItem(VISIBLE_KEY));
}

export function writeVisibleSet(slugs: string[]) {
  if (typeof window === 'undefined') return;
  const value = JSON.stringify(slugs);
  window.localStorage.setItem(VISIBLE_KEY, value);
  document.cookie = `${VISIBLE_KEY}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(VISIBLE_CHANGE_EVENT, { detail: slugs }));
}

export function clearVisibleSet() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(VISIBLE_KEY);
  document.cookie = `${VISIBLE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(VISIBLE_CHANGE_EVENT, { detail: null }));
}

export function openPicker() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(VISIBLE_OPEN_EVENT));
}
