import { useNavigate } from "react-router-dom";
import Brand from "../components/Brand";
import RecentSummariesSection from "../components/history/RecentSummariesSection";
import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const { user, logout, logoutAll } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  async function handleLogoutAll() {
    await logoutAll();
    navigate("/");
  }

  const initial = (user?.username || user?.email || "?").charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-3xl px-6 pt-8">
        <Brand />
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <span className="eyebrow">Your account</span>
        <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tight text-paper">
          Account
        </h1>

        <div className="mt-8 card flex items-center gap-4 p-6">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="" className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-violet font-display text-xl font-bold text-ink">
              {initial}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-paper">{user?.username}</p>
            <p className="truncate font-mono text-sm text-paper-muted">{user?.email}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card p-5">
            <span className="eyebrow">Provider</span>
            <p className="mt-2 text-sm capitalize text-paper/90">{user?.provider || "local"}</p>
          </div>
          <div className="card p-5">
            <span className="eyebrow">Email status</span>
            <p className="mt-2 text-sm text-paper/90">
              {user?.is_verified ? (
                <span className="text-teal">Verified</span>
              ) : (
                <span className="text-coral">Not verified</span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button onClick={handleLogout} className="btn-primary">
            Log out
          </button>
          <button
            onClick={handleLogoutAll}
            className="rounded-full border border-danger/40 bg-danger/10 px-6 py-3 text-sm font-semibold text-danger transition-colors duration-150 hover:bg-danger/20"
          >
            Log out of all devices
          </button>
        </div>

        <RecentSummariesSection />
      </main>
    </div>
  );
}
