import axiosInstance from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

const profileService = {
  /**
   * Fetch the full profile of the authenticated user.
   * The /users/profile endpoint may return richer data than /auth/me
   * (e.g. updatedAt, lastLogin) so this is kept separate.
   * @returns {{ user: object }}
   */
  async getProfile() {
    const { data } = await axiosInstance.get(ENDPOINTS.PROFILE);
    return data;
  },

  /**
   * Update mutable profile fields (currently: name).
   * Backend returns the updated user object.
   * @param {{ name: string }} payload
   * @returns {{ user: object, message: string }}
   */
  async updateProfile(payload) {
    const { data } = await axiosInstance.patch(
      ENDPOINTS.UPDATE_PROFILE,
      payload,
    );
    return data;
  },

  /**
   * Change the user's password.
   * Requires the current password for re-authentication.
   * @param {{ currentPassword: string, newPassword: string }} payload
   * @returns {{ message: string }}
   */
  async changePassword({ currentPassword, newPassword }) {
    const { data } = await axiosInstance.patch(ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return data;
  },

  /**
   * Request an email change.
   * Backend sends a verification link to the new address.
   * The change is not applied until the new address is confirmed.
   * @param {{ newEmail: string, password: string }} payload
   * @returns {{ message: string }}
   */
  async changeEmail({ newEmail, password }) {
    const { data } = await axiosInstance.patch(ENDPOINTS.CHANGE_EMAIL, {
      newEmail,
      password,
    });
    return data;
  },

  async deleteAccount(password) {
    const { data } = await axiosInstance.delete(ENDPOINTS.DELETE_ACCOUNT, {
      data: { password },
    });
    return data;
  },

  async uploadAvatar(file) {
    const formData = new FormData();

    formData.append("avatar", file);

    const { data } = await axiosInstance.post(
      ENDPOINTS.UPLOAD_AVATAR,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  },
};

export default profileService;
