import axios from 'axios';

const apiUrl = 'http://localhost:3000';

const assignmentService = {
  addAssignment: async (assignmentData: any) => {
    const response = await axios.post(`${apiUrl}/assignmentRoutes`, assignmentData);
    return response.data;
  },

//   getAssignmentsByFaculty: async (facultyId: string) => {
//     const response = await axios.get(`${apiUrl}/assignmentQuestionRoutes/faculty/questions/${facultyId}`);
//     console.log('Assignments API Response:', response);
//     return response.data.assignments;
//   },

getAssignmentsByFaculty: async (facultyId: string) => {
  try {
    const response = await axios.get(`${apiUrl}/assignmentQuestionRoutes/faculty/assignments/${facultyId}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
},

getAssignmentsByFacultyAndCourse: async (facultyId: string,courseId :string) => {
  try {
    const response = await axios.get(`${apiUrl}/assignmentRoutes/assignments/${facultyId}/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
},


// getAssignmentsByFaculty: async (facultyId: string, courseId: number | string) => {
//     const response = await axios.get(`${apiUrl}/assignments/${facultyId}/${courseId}`);
//     return response.data.assignments;
//   },

getAssignmentsWithQuestionsByFaculty: async (facultyId: string) => {
    try {
      const response = await axios.get(`${apiUrl}/assignmentQuestionRoutes/faculty/questions/${facultyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments with questions:', error);
      throw error; 
    }
  },
  
  linkQuestionToAssignment: async (assignmentId: string, questionId: string) => {
    const response = await axios.post(`${apiUrl}/assignmentQuestionRoutes`, { assignmentId, questionId });
    return response.data;
  },
  removeAssignment: async (assignmentId: number) => {
    try {
      const response = await axios.delete(`${apiUrl}/assignmentRoutes/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing assignment:', error);
      throw error;
    }
},
getAssignmentsByCourse: async (courseId: string) => {
  console.log('getAssignmetBycourse',courseId);
    const response = await axios.get(`${apiUrl}/assignmentQuestionRoutes/course/${courseId}`);
    console.log('getAssignmetBycourse',response.data.questions);
    return response.data.questions;
  },

  getAssignmentsWithFacultyDetails: async () => {
    const response = await axios.get(`${apiUrl}/facultycourse/faculty-course-assignments`);
    return response.data.assignments;
  },

  getAssignmentsByAssignmentId: (assignmentId: string) =>
    axios.get(`${apiUrl}/assignmentQuestionRoutes/${assignmentId}`).then((res) => res.data),
}
export default assignmentService;
