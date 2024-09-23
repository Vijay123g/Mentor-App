const db = require('../connection/database');

module.exports = class Question {
  constructor(courseId, facultyId, questionText) {
    this.courseId = courseId;
    this.facultyId = facultyId;
    this.questionText = questionText;
  }

  static async createQuestion(question) {
    const { courseId, facultyId, questionText } = question;
    try {
      const [result] = await db.execute(
        'INSERT INTO Questions (course_id, faculty_id, question_text) VALUES (?, ?, ?)',
        [courseId, facultyId, questionText]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  static async getQuestionsByCourse(courseId) {
    try {
      const [questions] = await db.execute(
        'SELECT * FROM questions WHERE course_id = ?',
        [courseId]
      );
      return questions;
    } catch (error) {
      throw error;
    }
  }

  static async getQuestionsByFaculty(course_id,faculty_id ) {
    try {
      const [questions] = await db.execute(
        'SELECT * FROM Questions WHERE course_id  = ? and faculty_id = ?',
        [course_id,faculty_id ]
      );
      return questions;
    } catch (error) {
      console.error('Error fetching questions by faculty:', error);
      throw error;
    }
  }
};
