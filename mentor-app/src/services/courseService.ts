import axios from 'axios';

const apiUrl = 'http://localhost:3000';

const courseService = {

  createCourse: async (course: any) => {
    const response = await axios.post(`${apiUrl}/course`, course);
    return response.data;
  },

  getCourses: async () => {
    const response = await axios.get('http://localhost:3000/course');
    return response.data.courses;
  },

  getFacultyDetails: async () => {
    const response = await axios.get(`${apiUrl}/admin/users/role/faculty`);
    return response.data;
  },

  // assignCourse: async (data: { facultyId: number, courseId: number }) => {
  //   const response = await axios.post(`${apiUrl}/facultycourse/assign`, data);
  //   return response.data;
  // },
  // getCourses: async () => {
  //   const response = await axios.get(`${apiUrl}/admin/view-course`);
  //   return response.data;
  // },

  // getFacultyDetails: async () => {
  //   const response = await axios.get(`${apiUrl}/admin/faculty-details`);
  //   return response.data;
  // },

  getFacultyCourseList: async (facultyId: string) => {
    const response = await axios.get(`${apiUrl}/facultycourse/${facultyId}/courses`);
    return response.data;
},

  // assignCourse: async (courseData: any) => {
  //   const response = await axios.post(`${apiUrl}/admin/course/assign`, courseData);
  //   return response.data;
  // },

  getRegisteredCourses: async (studentId: string) => {
    const response = await axios.get(`${apiUrl}/admin/student-courses/${studentId}`);
    return response.data;
  },

  assignCourse: async (assignmentData: { facultyId: number, courseId: number }) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${apiUrl}/facultycourse/assign`, assignmentData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getAssignedCourses: async (facultyId?: string) => {
    if (facultyId) {
      const response = await axios.get(`${apiUrl}/facultycourse/${facultyId}/assigned-courses`);
      return response.data.courses;
    } else {
      const response = await axios.get(`${apiUrl}/facultycourse/all/assigned-courses`);
      return response.data.courses;
    }
  },

  getDetailedFacultyCourseList: async () => {
    const response = await axios.get(`${apiUrl}/facultycourse/faculty-course-assignments`);
    return response.data; 
  },

  // createCourse: async (course: any) => {
  //   const response = await axios.post(`${apiUrl}/admin/course`, course);
  //   return response.data;
  // }
};

export default courseService;
