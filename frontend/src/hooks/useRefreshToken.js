import { useCallback } from "react";
import { useAuth } from "./useAuth";

export function useRefreshToken() {
  const { refreshSession } = useAuth();

  /**
   * Trigger a session refresh.
   * Returns the new access token on success.
   * @returns {Promise<string>}
   */
  const refresh = useCallback(async () => {
    const data = await refreshSession();
    return data?.accessToken;
  }, [refreshSession]);

  return refresh;
}
