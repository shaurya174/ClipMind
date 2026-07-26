import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { useAuth } from "../../context/AuthContext";

export default function VerifyEmailPage() {
  const { verifyEmail } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token found in this link.");
      return;
    }

    let cancelled = false;
    verifyEmail(token)
      .then(() => {
        if (!cancelled) setStatus("success");
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(err.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, verifyEmail]);

  return (
    <AuthLayout
      eyebrow="Email verification"
      title="Verify email"
      footer={
        <Link to="/" className="text-violet hover:underline">
          Back to ClipMind
        </Link>
      }
    >
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        {status === "verifying" && (
          <>
            <div className="flex gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:300ms]" />
            </div>
            <p className="font-mono text-xs text-paper-muted">Verifying your email…</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/15 text-teal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-sm text-paper/90">Your email is verified. You're all set.</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <p className="text-sm text-danger">{errorMessage}</p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
