import axios from 'axios';

const url = 'http://localhost:3000/auth';
const adminUrl = 'http://localhost:3000/admin';

type User =  any;

const authService = {
  signup: async (user: Omit<User, 'id'>) => {

    const response = await axios.post(`${url}/signup`, user);
    console.log('response',response);
    return response.data;
  },

  createFaculty: async (facultyData: Omit<User, 'id'>) => {
    const response = await axios.post(`${adminUrl}/create-faculty`, facultyData);
    return response.data;
  },

  login: async (credentials: { email: string, password: string }) => {
    const response = await axios.post(`${url}/login`, credentials);
    const tokenObject = response.data;
    
    localStorage.setItem('token', tokenObject.token);
    localStorage.setItem('userId', tokenObject.userId);
    localStorage.setItem('role', tokenObject.role);
    localStorage.setItem('name', tokenObject.name);

    return tokenObject;
  },

  getCounts: async () => {
    const response = await axios.get(`${adminUrl}/counts`);
    return response.data;
  },

  getRole: () => localStorage.getItem('role') || 'Student',

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
};

export default authService;
