import axios from 'axios';

const apiUrl = 'http://localhost:3000';

const courseService = {
  getCourses: async () => {
    const response = await axios.get(`${apiUrl}/admin/view-course`);
    return response.data;
  },

  getFacultyDetails: async () => {
    const response = await axios.get(`${apiUrl}/admin/faculty-details`);
    return response.data;
  },

  getFacultyCourseList: async (facultyId: string) => {
    const response = await axios.get(`${apiUrl}/admin/faculty-courses/${facultyId}`);
    return response.data;
  },

  assignCourse: async (courseData: any) => {
    const response = await axios.post(`${apiUrl}/admin/course/assign`, courseData);
    return response.data;
  },

  getRegisteredCourses: async (studentId: string) => {
    const response = await axios.get(`${apiUrl}/admin/student-courses/${studentId}`);
    return response.data;
  },

  getAssignedCourses: async () => {
    const response = await axios.get(`${apiUrl}/admin/assigned-courses`);
    return response.data;
  },

  createCourse: async (course: any) => {
    const response = await axios.post(`${apiUrl}/admin/course`, course);
    return response.data;
  }
};

export default courseService;
