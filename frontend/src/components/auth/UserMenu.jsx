import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserMenu() {
  const { user, isAuthenticated, isBootstrapping, logout, logoutAll } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isBootstrapping) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-ink-surface2" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="font-mono text-xs uppercase tracking-wide text-paper-muted hover:text-paper"
        >
          Log in
        </Link>
        <Link
          to="/register"
          className="rounded-full border border-ink-border bg-ink-surface px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper transition-colors duration-150 hover:border-violet/60 hover:text-violet"
        >
          Sign up
        </Link>
      </div>
    );
  }

  async function handleLogout() {
    setBusy(true);
    try {
      await logout();
    } finally {
      setBusy(false);
      setOpen(false);
      navigate("/");
    }
  }

  async function handleLogoutAll() {
    setBusy(true);
    try {
      await logoutAll();
    } finally {
      setBusy(false);
      setOpen(false);
      navigate("/");
    }
  }

  const initial = (user?.username || user?.email || "?").charAt(0).toUpperCase();

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-ink-border bg-ink-surface py-1 pl-1 pr-3 transition-colors duration-150 hover:border-violet/60"
      >
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet font-display text-xs font-bold text-ink">
            {initial}
          </span>
        )}
        <span className="max-w-[100px] truncate font-mono text-xs text-paper">
          {user?.username || user?.email}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-ink-border bg-ink-surface shadow-xl shadow-black/40 animate-fadeUp">
          <div className="border-b border-ink-border px-4 py-3">
            <p className="truncate text-sm font-semibold text-paper">{user?.username}</p>
            <p className="truncate font-mono text-[11px] text-paper-muted">{user?.email}</p>
            {!user?.is_verified && (
              <span className="mt-1.5 inline-block rounded-full bg-coral/15 px-2 py-0.5 font-mono text-[10px] text-coral">
                Email not verified
              </span>
            )}
          </div>
          <div className="p-1.5">
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm text-paper transition-colors duration-150 hover:bg-ink-surface2"
            >
              Account
            </Link>
            <button
              onClick={handleLogout}
              disabled={busy}
              className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-paper transition-colors duration-150 hover:bg-ink-surface2 disabled:opacity-50"
            >
              Log out
            </button>
            <button
              onClick={handleLogoutAll}
              disabled={busy}
              className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-danger transition-colors duration-150 hover:bg-ink-surface2 disabled:opacity-50"
            >
              Log out of all devices
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
