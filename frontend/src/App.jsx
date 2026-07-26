import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Processing from "./pages/Processing";
import Result from "./pages/Result";
import MindMapPage from "./pages/MindMapPage";
import TranscriptPage from "./pages/TranscriptPage";
import AccountPage from "./pages/AccountPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import OAuthCallbackPage from "./pages/auth/OAuthCallbackPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/processing/:jobId" element={<Processing />} />
      <Route path="/result/:jobId" element={<Result />} />
      <Route path="/mindmap/:videoId" element={<MindMapPage />} />
      <Route path="/transcript/:videoId" element={<TranscriptPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
