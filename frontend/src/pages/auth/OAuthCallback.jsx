import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();

  useEffect(() => {
    async function completeLogin() {
      try {
        await refreshSession();

        navigate("/dashboard", {
          replace: true,
        });
      } catch {
        navigate("/login", {
          replace: true,
        });
      }
    }

    completeLogin();
  }, [navigate, refreshSession]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Signing you in...</p>
    </div>
  );
}