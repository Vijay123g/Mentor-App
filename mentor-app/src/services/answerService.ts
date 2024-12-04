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

  validateAnswer: async (answerId: string, validatedBy: string, validationStatus: number, score: number) => {
    const response = await axios.put(`${baseUrl}/answer/validate`, {
      answerId,
      validatedBy,
      validationStatus,
      score,
    });
    return response.data;
  },
  

  // submitAnswer: async (answerData: any) => {
  //   const response = await axios.post(`${baseUrl}/answer`, answerData);
  //   return response.data;
  // },
  submitAnswer: async (answerData: FormData) => {
    const response = await axios.post(`${baseUrl}/answer`, answerData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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
    const response = await axios.get(`${baseUrl}/answer/student/${studentId}`);
    return response.data;
  },

  getAnswersByFaculty: async (facultyId: any) => {
    const response = await axios.get(`${baseUrl}/answer/faculty/${facultyId}/answers`);
    return response.data;
  },
  


  downloadFile: async (fileId: string) => {
    const response = await axios.get(`${baseUrl}/answer/file/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

};

export default answerService;
