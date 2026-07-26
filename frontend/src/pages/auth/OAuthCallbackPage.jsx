import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { setTokens } from "../../services/tokenStore";

/**
 * Landing point after the backend's OAuth redirect completes.
 *
 * NOTE: the API contract only specifies the endpoints that *start* the
 * OAuth flow (/auth/oauth/{provider}/login and .../callback) — it doesn't
 * specify what the backend hands back to the frontend afterward. This page
 * assumes the most common convention: the backend redirects the browser
 * here with `access_token` and `refresh_token` as query params, e.g.
 *   https://your-frontend.app/oauth/callback?access_token=...&refresh_token=...
 * If your backend uses a different convention (a different route, tokens
 * in a fragment, a one-time code to exchange, etc.), this is the one file
 * that needs to change to match it.
 */
export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshCurrentUser } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (!accessToken) {
      setError("No access token was returned from the sign-in provider.");
      return;
    }

    setTokens({ access_token: accessToken, refresh_token: refreshToken });

    refreshCurrentUser()
      .then(() => navigate("/", { replace: true }))
      .catch(() => setError("Signed in, but couldn't load your profile. Try refreshing the page."));
    // Only run once, when the callback params first arrive.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthLayout
      eyebrow="Signing you in"
      title="One moment"
      footer={
        <Link to="/login" className="text-violet hover:underline">
          Back to log in
        </Link>
      }
    >
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        {error ? (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <p className="text-sm text-danger">{error}</p>
          </>
        ) : (
          <>
            <div className="flex gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:300ms]" />
            </div>
            <p className="font-mono text-xs text-paper-muted">Finishing sign-in…</p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
