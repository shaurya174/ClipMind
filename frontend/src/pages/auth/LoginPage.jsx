import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import OAuthButtons from "../../components/auth/OAuthButtons";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login, authError, setAuthError, googleLoginUrl, githubLoginUrl } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch {
      // authError is already set inside the auth context
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in"
      subtitle="Pick up your summaries, chats, and mind maps where you left off."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="text-violet hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-paper-muted">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="w-full rounded-xl border border-ink-border bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none focus:border-violet/60"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wide text-paper-muted">
              Password
            </label>
            <Link to="/forgot-password" className="font-mono text-[11px] text-violet hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-ink-border bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none focus:border-violet/60"
            placeholder="••••••••"
          />
        </div>

        {authError && (
          <p className="font-mono text-xs text-danger animate-fadeUp">{authError}</p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary mt-1 w-full">
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink-border" />
        <span className="font-mono text-[11px] uppercase tracking-wide text-paper-muted">or</span>
        <div className="h-px flex-1 bg-ink-border" />
      </div>

      <OAuthButtons googleUrl={googleLoginUrl} githubUrl={githubLoginUrl} />
    </AuthLayout>
  );
}
