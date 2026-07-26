import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { useAuth } from "../../context/AuthContext";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Reset access"
      title="Forgot password"
      subtitle="We'll send a reset link to your email if an account exists."
      footer={
        <Link to="/login" className="text-violet hover:underline">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center animate-fadeUp">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet/15 text-violet">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16v16H4z" />
              <path d="m22 6-10 7L2 6" />
            </svg>
          </div>
          <p className="text-sm text-paper/90">
            If an account exists for <span className="text-paper">{email}</span>, a reset link is
            on its way.
          </p>
        </div>
      ) : (
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

          {error && <p className="font-mono text-xs text-danger animate-fadeUp">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary mt-1 w-full">
            {submitting ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
