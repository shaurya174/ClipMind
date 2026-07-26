import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Gates a route behind authentication. Only applied where the backend
 * itself requires a Bearer token (e.g. the Account page, which calls
 * /auth/me and /auth/logout-all) — the core summarize/chat/mind
 * map/transcript flows don't require auth per the API contract, so they
 * stay open rather than being gated for no functional reason.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
