import { API_BASE, client, unwrap } from "./api";

/**
 * @param {{email: string, username: string, password: string}} payload
 */
export function registerUser({ email, username, password }) {
  return unwrap(client.post("/auth/register", { email, username, password }));
}

/**
 * @param {{email: string, password: string}} payload
 */
export function loginUser({ email, password }) {
  return unwrap(client.post("/auth/login", { email, password }));
}

/**
 * Direct refresh call, exposed for completeness — the api.js interceptor
 * already calls this internally on a 401, so most code never needs to call
 * it by hand.
 */
export function refreshSession(refresh_token) {
  return unwrap(client.post("/auth/refresh", { refresh_token }, { _isRefreshCall: true }));
}

export function logoutUser(refresh_token) {
  return unwrap(client.post("/auth/logout", { refresh_token }));
}

export function logoutAllDevices() {
  return unwrap(client.post("/auth/logout-all"));
}

export function getCurrentUser() {
  return unwrap(client.get("/auth/me"));
}

export function forgotPassword(email) {
  return unwrap(client.post("/auth/forgot-password", { email }));
}

export function resetPassword({ token, new_password }) {
  return unwrap(client.post("/auth/reset-password", { token, new_password }));
}

export function verifyEmail(token) {
  return unwrap(client.post("/auth/verify-email", { token }));
}

/**
 * OAuth is a full browser redirect flow, not an XHR call — these just build
 * the URLs the login buttons point at.
 */
export function getGoogleOAuthUrl() {
  return `${API_BASE}/auth/oauth/google/login`;
}

export function getGithubOAuthUrl() {
  return `${API_BASE}/auth/oauth/github/login`;
}
