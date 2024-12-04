import axios from 'axios';

const apiUrl = 'http://localhost:3000/question';

const questionService = {

  addQuestion: async (questionData: any) => {
    const response = await axios.post(`${apiUrl}`, questionData);
    return response.data;
  },
  getQuestions: async () => {
    const response = await axios.get(`${apiUrl}/questions`);
    return response.data.questions;
  },

  getQuestionsByCourse: async (courseId: string) => {
    const response = await axios.get(`${apiUrl}/${courseId}`);
    return response.data;
  },

  getQuestionsByFaculty: async (facultyId: string,courseId: number | string, ) => {
    const response = await axios.get(`${apiUrl}/faculty/${facultyId}/course/${courseId}`);
    return response.data.questions; 
  },
  
};

export default questionService;
