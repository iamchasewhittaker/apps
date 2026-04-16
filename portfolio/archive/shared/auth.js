import { createClient } from '@supabase/supabase-js';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

function isTruthy(value) {
  return value === '1' || value === 'true' || value === 'yes';
}

function normalizeOrigin(origin) {
  if (!origin) return '';
  return String(origin).trim().replace(/\/+$/, '');
}

function normalizePath(pathValue) {
  if (!pathValue) return '';
  const trimmed = String(pathValue).trim();
  if (!trimmed) return '';
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+$/, '');
}

function joinUrl(origin, pathValue) {
  if (!origin) return '';
  const path = normalizePath(pathValue);
  return path ? `${origin}${path}` : origin;
}

function isLocalHost(hostname) {
  return LOCAL_HOSTS.has(hostname);
}

function authDebugEnabled() {
  return isTruthy(process.env.REACT_APP_AUTH_DEBUG || '');
}

export function getAuthConfig(config = {}) {
  const appName = config.appName || 'app';
  const canonicalOrigin = normalizeOrigin(config.canonicalOrigin || process.env.REACT_APP_AUTH_CANONICAL_ORIGIN);
  const canonicalPath = normalizePath(config.canonicalPath || process.env.REACT_APP_AUTH_APP_PATH);
  const canonicalAppUrl = joinUrl(canonicalOrigin, canonicalPath);
  const storageKey = config.storageKey || process.env.REACT_APP_SUPABASE_STORAGE_KEY || 'chase_portfolio_auth_token';

  return { appName, canonicalOrigin, canonicalPath, canonicalAppUrl, storageKey };
}

export function debugAuth(appName, message, payload) {
  if (!authDebugEnabled()) return;
  if (payload === undefined) {
    console.log(`[auth:${appName}] ${message}`);
    return;
  }
  console.log(`[auth:${appName}] ${message}`, payload);
}

export function maybeRedirectToCanonical(authConfig) {
  if (typeof window === 'undefined') return false;
  const { appName, canonicalOrigin, canonicalAppUrl } = authConfig;
  if (!canonicalOrigin || !canonicalAppUrl) return false;
  if (isLocalHost(window.location.hostname)) return false;
  if (window.location.origin === canonicalOrigin) return false;

  const targetUrl = `${canonicalAppUrl}${window.location.search || ''}${window.location.hash || ''}`;
  debugAuth(appName, 'redirecting_to_canonical', {
    from: window.location.href,
    to: targetUrl,
  });
  window.location.replace(targetUrl);
  return true;
}

export function getEmailRedirectUrl(authConfig) {
  if (authConfig.canonicalAppUrl) return authConfig.canonicalAppUrl;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

export function createPortfolioAuthClient(supabaseUrl, supabaseKey, authConfig) {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: authConfig.storageKey,
    },
  });
}
