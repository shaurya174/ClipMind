import { Link } from "react-router-dom";

export default function ErrorState({ title = "Something went wrong", message, actionLabel = "Back to home", actionTo = "/" }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-danger/30 bg-danger/5 px-8 py-10 text-center animate-fadeUp">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
      <h2 className="font-display text-2xl font-bold uppercase text-paper">{title}</h2>
      {message && <p className="text-sm text-paper-muted">{message}</p>}
      <Link to={actionTo} className="btn-primary mt-2">
        {actionLabel}
      </Link>
    </div>
  );
}
