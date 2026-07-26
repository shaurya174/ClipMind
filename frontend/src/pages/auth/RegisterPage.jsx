import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import OAuthButtons from "../../components/auth/OAuthButtons";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const { register, authError, setAuthError, googleLoginUrl, githubLoginUrl } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setAuthError(null);
    setValidationError(null);

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await register({ email: email.trim(), username: username.trim(), password });
      navigate("/", { replace: true });
    } catch {
      // authError is already set inside the auth context
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create account"
      subtitle="Save your summaries, chats, and mind maps to come back to later."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-violet hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-paper-muted">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            className="w-full rounded-xl border border-ink-border bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none focus:border-violet/60"
            placeholder="yourname"
          />
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-paper-muted">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-ink-border bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none focus:border-violet/60"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-paper-muted">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-ink-border bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none focus:border-violet/60"
            placeholder="At least 8 characters"
          />
        </div>

        {(validationError || authError) && (
          <p className="font-mono text-xs text-danger animate-fadeUp">
            {validationError || authError}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary mt-1 w-full">
          {submitting ? "Creating account…" : "Create account"}
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
