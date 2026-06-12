import axiosInstance from "../api/axios";

const BASE = "/users/sessions";

const sessionService = {
  /**
   * Fetch all active sessions for the authenticated user.
   * @returns {{ sessions: object[] }}
   */
  async getSessions() {
    const { data } = await axiosInstance.get(BASE);
    return data;
  },

  /**
   * Revoke a single session by ID.
   * @param {string} sessionId
   * @returns {{ message: string }}
   */
  async revokeSession(sessionId) {
    const { data } = await axiosInstance.delete(`${BASE}/${sessionId}`);
    return data;
  },

  /**
   * Revoke ALL sessions except the current one (or including it, depending
   * on the backend implementation — UI will redirect to login after).
   * @returns {{ message: string }}
   */
  async revokeAllSessions() {
    const { data } = await axiosInstance.delete(BASE);
    return data;
  },
};

export default sessionService;
