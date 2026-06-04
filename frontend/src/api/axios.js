import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Singleton axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Required: sends httpOnly refresh-token cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Refresh Queue ────────────────────────────────────────────────────────────
// Only one refresh request happens at a time.
// Other 401s queue up and wait for the refresh to complete.

let isRefreshing = false;
let failedRequestsQueue = [];

function processQueue(error, newToken = null) {
  failedRequestsQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(newToken);
    }
  });
  failedRequestsQueue = [];
}

// ─── Token Getter (injected at runtime to avoid circular imports) ─────────────
// AuthContext will call axiosInstance.setTokenGetter(fn) after mounting.
let _getAccessToken = () => null;
let _onRefreshSuccess = (_token) => {};
let _onRefreshFailure = () => {};

axiosInstance.setTokenGetter = (fn) => {
  _getAccessToken = fn;
};
axiosInstance.onRefreshSuccess = (fn) => {
  _onRefreshSuccess = fn;
};
axiosInstance.onRefreshFailure = (fn) => {
  _onRefreshFailure = fn;
};

// ─── Request Interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  (config) => {
    const token = _getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Only intercept 401s. Skip if already retried or it's the refresh call itself.
    const is401 = error.response?.status === 401;
    const isRefreshEndpoint = originalRequest.url?.includes("/auth/refresh");
    const alreadyRetried = originalRequest._retry;
    const skipAuthRefresh = originalRequest.skipAuthRefresh;

    if (!is401 || isRefreshEndpoint || alreadyRetried || skipAuthRefresh) {
      return Promise.reject(error);
    }

    // If a refresh is already in-flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Mark as retried and start refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call refresh — cookie is sent automatically
      const { data } = await axiosInstance.post(
        "/auth/refresh",
        {},
        {
          withCredentials: true,
          skipAuthRefresh: true,
        },
      );

      const newAccessToken = data.accessToken;

      // Notify context so it can update in-memory token
      _onRefreshSuccess(newAccessToken);

      // Retry queued requests with new token
      processQueue(null, newAccessToken);

      // Retry the original request
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      _onRefreshFailure();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
