import axios from 'axios';

const apiUrl = 'http://localhost:3000/faculty';
const baseUrl = 'http://localhost:3000';

const facultyService = {
  getCoursesByFacultyId: async (facultyId: any) => {
    const response = await axios.get(`${apiUrl}/courses/${facultyId}`);
    return response.data;
  },

  getStudentSubmissionsByFacultyId: async (facultyId: number) => {
    const response = await axios.get(`${apiUrl}/submissions/${facultyId}`);
    return response.data;
  },

  getDetailedFacultyCourseData: async (facultyId: number) => {
    const response = await axios.get(`${baseUrl}/admin/courses/faculty/${facultyId}`);
    return response.data;
  }
};

export default facultyService;
