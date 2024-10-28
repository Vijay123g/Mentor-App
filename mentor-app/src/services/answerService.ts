import axios from 'axios';

const baseUrl = 'http://localhost:3000';

const answerService = {
  getAnswersToValidate: async () => {
    const response = await axios.get(`${baseUrl}/answers/validate`);
    return response.data;
  },
  
  getFacultyByCourse: async (courseId: number) => {
    const response = await axios.get(`${baseUrl}/answer/faculty/${courseId}`);
    return response.data;
  },

  validateAnswer: async (answerId: number, validatedBY: string, validationStatus: number) => {
    const response = await axios.put(`${baseUrl}/answer/answer/validate`, { answerId, validatedBY, validationStatus });
    return response.data;
  },

  submitAnswer: async (answerData: any) => {
    const response = await axios.post(`${baseUrl}/answer/answer`, answerData);
    return response.data;
  },

  getQuestionsByCourse: async (courseId: number) => {
    const response = await axios.get(`${baseUrl}/questions/${courseId}`);
    return response.data;
  },

  getAnswerStatus: async (registrationId: string) => {
    const response = await axios.get(`${baseUrl}/answer/answers/status/${registrationId}`);
    return response.data;
  },

  getAnswersByStudent: async (studentId: string) => {
    const response = await axios.get(`${baseUrl}/answer/answers/student/${studentId}`);
    return response.data;
  },

  getAnswersByFaculty: async (facultyId: string) => {
    const response = await axios.get(`${baseUrl}/answer/faculty/${facultyId}/answers`);
    return response.data;
  }
};

export default answerService;
