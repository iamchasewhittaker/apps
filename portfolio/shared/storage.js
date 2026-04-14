/**
 * /portfolio/shared/storage.js
 * Generic localStorage helpers for all portfolio web apps.
 *
 * Usage (after copying to src/shared/storage.js in your app):
 *   import { createStorage } from './shared/storage';
 *   const { load, save, loadDraft, saveDraft, clearDraft } =
 *     createStorage('chase_myapp_v1', 'chase_myapp_draft_v1');
 *
 * Note: save() stamps _syncAt so the Supabase sync layer can detect which copy is newer.
 * Note: draftKey is optional — pass null/undefined if your app has no draft state.
 */

export function createStorage(storeKey, draftKey = null) {
  function load() {
    try { return JSON.parse(localStorage.getItem(storeKey)) || {}; } catch { return {}; }
  }

  function save(data) {
    try {
      localStorage.setItem(storeKey, JSON.stringify({ ...data, _syncAt: Date.now() }));
    } catch {}
  }

  function loadDraft() {
    if (!draftKey) return {};
    try { return JSON.parse(localStorage.getItem(draftKey)) || {}; } catch { return {}; }
  }

  function saveDraft(data) {
    if (!draftKey) return;
    try { localStorage.setItem(draftKey, JSON.stringify(data)); } catch {}
  }

  function clearDraft() {
    if (!draftKey) return;
    try { localStorage.removeItem(draftKey); } catch {}
  }

  return { load, save, loadDraft, saveDraft, clearDraft };
}
