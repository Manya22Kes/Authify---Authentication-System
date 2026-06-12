import axiosInstance from "../api/axios";

const securityService = {
  /**
   * Fetch the security overview for the authenticated user.
   * @returns {SecurityOverview}
   */
  async getSecurityOverview() {
    const { data } = await axiosInstance.get("/users/security");
    return data.data;
  },
};

export default securityService;
