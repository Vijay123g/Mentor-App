import axios from 'axios';

const url = 'http://localhost:3000/auth';
const adminUrl = 'http://localhost:3000/admin';

type User = any;

const authService = {
  login: async (data: any) => {
    const response = await axios.post(`${adminUrl}/login`, data);
    return response.data;
  },

  signup: async (data: any) => {
    const response = await axios.post(`${adminUrl}/signup`, data);
    return response.data;
  },

  createFaculty: async (facultyData: Omit<User, 'id'>) => {
    const response = await axios.post(`${adminUrl}/signup`, facultyData);
    return response.data;
  },

  getUsersByRole: async (role: string) => {
    const response = await axios.get(`${adminUrl}/users/role/${role}`);
    return response.data;
  },

  getCountByRole: async (role: string) => {
    const response = await axios.get(`${adminUrl}/users/role/${role}/count`);
    return response.data.count;
  },

  getFacultyCount: async () => authService.getCountByRole('faculty'),
  getStudentCount: async () => authService.getCountByRole('student'),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  },

  generateOtp: async (data: { email: string }) => {
    const response = await axios.post(`${adminUrl}/send-otp`, data);
    return response.data;
  },

  verifyOtp: async (data: { email: string; otp: string }) => {
    const response = await axios.post(`${adminUrl}/verify-otp`, data);
    return response.data;
  },
};

export default authService;
