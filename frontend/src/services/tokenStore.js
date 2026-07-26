const ACCESS_KEY = "clipmind_access_token";
const REFRESH_KEY = "clipmind_refresh_token";

/**
 * Centralized token persistence. Tokens live in localStorage rather than
 * an httpOnly cookie because the backend contract hands them back directly
 * in the JSON response body — there's no backend-managed cookie to rely on
 * instead. (A cookie-based flow set by the server would be more resistant
 * to XSS if the backend ever supports it, but that's not what this API
 * contract offers today.)
 */
export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens({ access_token, refresh_token } = {}) {
  if (access_token) localStorage.setItem(ACCESS_KEY, access_token);
  if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
