import axiosInstance from '../api/axios';

const adminService = {
  async getDashboard() {
    const { data } = await axiosInstance.get('/admin/dashboard');
    return data;
  },
};

export default adminService;
