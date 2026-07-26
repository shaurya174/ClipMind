import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { useAuth } from "../../context/AuthContext";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is missing its token. Request a new one.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({ token, new_password: password });
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Almost there"
      title="Reset password"
      subtitle="Choose a new password for your account."
      footer={
        <Link to="/login" className="text-violet hover:underline">
          Back to log in
        </Link>
      }
    >
      {!token && (
        <p className="mb-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 font-mono text-xs text-danger">
          No reset token found in this link. Request a new password reset email.
        </p>
      )}

      {done ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center animate-fadeUp">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/15 text-teal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-sm text-paper/90">Password reset. Taking you to log in…</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-paper-muted">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full rounded-xl border border-ink-border bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none focus:border-violet/60"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-paper-muted">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-ink-border bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none focus:border-violet/60"
              placeholder="Repeat password"
            />
          </div>

          {error && <p className="font-mono text-xs text-danger animate-fadeUp">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary mt-1 w-full">
            {submitting ? "Resetting…" : "Reset password"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
