import 'server-only';
import { cookies } from 'next/headers';
import { VISIBLE_KEY, parseSlugList } from './visible-projects';

export async function readVisibleSetFromCookie(): Promise<Set<string> | null> {
  const store = await cookies();
  const raw = store.get(VISIBLE_KEY)?.value;
  const slugs = parseSlugList(raw ? decodeURIComponent(raw) : null);
  return slugs ? new Set(slugs) : null;
}
