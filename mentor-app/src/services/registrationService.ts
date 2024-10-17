import axios from 'axios';

const baseUrl = 'http://localhost:3000';

const registrationService = {
  registerStudent: async (registration: any, courseId: any) => {
    const response = await axios.post(`${baseUrl}/register`, registration);
    return response.data;
  },

  registerCourse: async (studentId: string, courseId: number) => {
    const response = await axios.post(`${baseUrl}/registration/register`, { studentId, courseId });
    return response.data;
  },

  getRegistrationsByStudent: async (studentId: string) => {
    const response = await axios.get(`${baseUrl}/registrations/student/${studentId}`);
    return response.data;
  },

  getRegistrationsByCourse: async (courseId: number) => {
    const response = await axios.get(`${baseUrl}/registration/registrations/course/${courseId}`);
    return response.data;
  },

  unregisterStudent: async (registrationId: number) => {
    const response = await axios.delete(`${baseUrl}/unregister/${registrationId}`);
    return response.data;
  }
};

export default registrationService;
