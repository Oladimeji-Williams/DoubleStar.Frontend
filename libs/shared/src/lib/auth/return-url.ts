// libs/shared/src/lib/auth/return-url.ts
// "Send me back where I was going" after login, without touching the (credential-guarded) login page:
// guards remember the URL, and the app's '' route consumes it once after sign-in.
const KEY = 'doublestar.returnUrl';

export function rememberReturnUrl(url?: string | null): void {
  if (!url || url === '/' || url.startsWith('/login') || url.startsWith('/register')) {
    return;
  }

  try {
    sessionStorage.setItem(KEY, url);
  } catch {
    // storage unavailable (SSR / private mode) — losing the return URL is harmless
  }
}

/** Reads and clears the remembered URL. Only same-site relative paths are ever returned (no open redirect). */
export function consumeReturnUrl(): string | null {
  try {
    const value = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);

    return value && value.startsWith('/') && !value.startsWith('//') ? value : null;
  } catch {
    return null;
  }
}