import axios from 'axios';

const apiUrl = 'http://localhost:3000/question/question';
const baseUrl = 'http://localhost:3000/question';

const questionService = {
  addQuestion: async (question: { courseId: number, facultyId: string, questionText: string }) => {
    const response = await axios.post(apiUrl, question);
    return response.data;
  },

  getQuestionsByCourse: async (courseId: number) => {
    const response = await axios.get(`${apiUrl}/${courseId}`);
    return response.data;
  },

  getQuestionsByFaculty: async (courseId: number, facultyId: string) => {
    const response = await axios.get(`${baseUrl}/faculty/${courseId}/${facultyId}`);
    return response.data;
  }
};

export default questionService;
