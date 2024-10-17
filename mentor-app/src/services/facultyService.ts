import axios from 'axios';

const apiUrl = 'http://localhost:3000/faculty';

const facultyService = {
  getCoursesByFacultyId: async (facultyId: any) => {
    const response = await axios.get(`${apiUrl}/courses/${facultyId}`);
    return response.data;
  },

  getStudentSubmissionsByFacultyId: async (facultyId: number) => {
    const response = await axios.get(`${apiUrl}/submissions/${facultyId}`);
    return response.data;
  }
};

export default facultyService;
