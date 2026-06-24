import axiosInstance from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

function unwrapResponse(data) {
  if (data?.data && typeof data.data === "object") {
    return data.data;
  }
  return data;
}

function extractSession(data) {
  const payload = unwrapResponse(data);

  return {
    accessToken: payload?.accessToken ?? null,
    user: payload?.user ?? null,
    success: payload?.success ?? data?.success ?? false,
    message: payload?.message ?? data?.message ?? "",
  };
}

function extractVerificationResponse(data) {
  const payload = unwrapResponse(data);

  return {
    success: data?.success ?? false,
    message: data?.message ?? "",
    user: payload?.user ?? payload ?? null,
  };
}

const authService = {
  async login(email, password) {
    const { data } = await axiosInstance.post(ENDPOINTS.LOGIN, {
      email,
      password,
    });
    return extractSession(data);
  },

  async register(name, email, password) {
    const { data } = await axiosInstance.post(ENDPOINTS.REGISTER, {
      name,
      email,
      password,
    });
    const payload = unwrapResponse(data);

    return {
      success: data?.success ?? false,
      message: data?.message ?? "",
      user: payload?.user ?? null,
      verificationEmailSent: Boolean(payload?.verificationEmailSent),
      verificationEmailId: payload?.verificationEmailId ?? null,
    };
  },
  async googleLogin(credential) {
    const { data } = await axiosInstance.post(ENDPOINTS.GOOGLE_LOGIN, {
      credential,
    });

    return extractSession(data);
  },

  async logout() {
    await axiosInstance.post(ENDPOINTS.LOGOUT);
  },

  async refreshSession() {
    const { data } = await axiosInstance.post(
      ENDPOINTS.REFRESH,
      {},
      {
        withCredentials: true,
        skipAuthRefresh: true,
      },
    );

    const session = extractSession(data);

    if (!session.accessToken) {
      throw new Error("Session refresh did not return an access token.");
    }

    if (!session.user) {
      session.user = await this.getMe(session.accessToken);
    }

    return session;
  },

  async getMe(accessTokenOverride) {
    const config = accessTokenOverride
      ? {
          headers: {
            Authorization: `Bearer ${accessTokenOverride}`,
          },
        }
      : undefined;

    const { data } = await axiosInstance.get(ENDPOINTS.ME, config);
    const payload = unwrapResponse(data);
    return payload?.user ?? payload;
  },

  async forgotPassword(email) {
    const { data } = await axiosInstance.post(ENDPOINTS.FORGOT_PASSWORD, {
      email,
    });
    return unwrapResponse(data);
  },

  async resetPassword(token, password) {
    const { data } = await axiosInstance.post(
      `${ENDPOINTS.RESET_PASSWORD}/${token}`,
      {
        password,
      },
    );
    return unwrapResponse(data);
  },

  async verifyEmail(token) {
    const { data } = await axiosInstance.get(
      `${ENDPOINTS.VERIFY_EMAIL}/${token}`,
    );
    return extractVerificationResponse(data);
  },

  async resendVerification(email) {
    const { data } = await axiosInstance.post(ENDPOINTS.RESEND_VERIFICATION, {
      email,
    });
    return unwrapResponse(data);
  },

  async getVerificationStatus() {
    const { data } = await axiosInstance.get(ENDPOINTS.VERIFICATION_STATUS);
    return unwrapResponse(data);
  },
};

export default authService;
