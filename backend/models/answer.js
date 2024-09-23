const db = require('../connection/database');

module.exports = class Answer {
  constructor(registrationId, questionId, answerText, validatedBy, validationStatus) {
    this.registrationId = registrationId;
    this.questionId = questionId;
    this.answerText = answerText;
    this.validatedBy = validatedBy;
    this.validationStatus = validationStatus;
  }

  static async submitAnswer(answer) {
    const { registrationId, questionId, answerText, validatedBy, validationStatus } = answer;
    try {
      const [result] = await db.execute(
        'INSERT INTO Exam_Answers (registration_id, question_id, answer_text, validated_by, validation_status) VALUES (?, ?, ?, ?, ?)',
        [registrationId, questionId, answerText, validatedBy, validationStatus]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }

  static async getCourseIdByQuestion(questionId) {
    try {
      const [result] = await db.execute(
        'SELECT course_id FROM Questions WHERE question_id = ?',
        [questionId]
      );
      return result.length > 0 ? result[0].course_id : null;
    } catch (error) {
      console.error('Error retrieving course ID by question:', error);
      throw error;
    }
  }

  static async getAnswersByRegistration(registrationId) {
    try {
      const [answers] = await db.execute(
        'SELECT * FROM Exam_Answers WHERE registration_id = ?',
        [registrationId]
      );
      return answers;
    } catch (error) {
      console.error('Error retrieving answers:', error);
      throw error;
    }
  }

  static async validateAnswer(answerId,validatedBy, validationStatus,) {
    try {
      const result = await db.execute(
        'UPDATE Exam_Answers SET validated_by = ?, validation_status = ? WHERE answer_id = ?',
        [validatedBy, validationStatus, answerId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error validating answer:', error);
      throw error;
    }
  }

  static async getFacultyIdByCourse(courseId) {
    try {
      const [rows] = await db.execute(
        'SELECT facultyId FROM Courses WHERE id = ?',
        [courseId]
      );
      if (rows.length > 0) {
        return rows[0].facultyId;
      } else {
        console.log('No faculty found for this course.');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving faculty ID by course:', error);
      throw error;
    }
  }

  static async getAnswersByStudent(studentId) {
    try {
      const [answers] = await db.execute(
        `SELECT ea.question_id,ea.answer_text,ea.validation_status,q.question_text,u.name
FROM exam_answers as ea
JOIN users u ON ea.validated_by = u.user_id JOIN questions q ON ea.question_id = q.question_id 
JOIN student_course_registration  r ON ea.registration_id = r.registration_id WHERE r.student_id = ?;`,
        [studentId]
      );
      return answers;
    } catch (error) {
      console.error('Error retrieving answers by student:', error);
      throw error;
    }
  }
  
  static async getAnswersByFaculty(facultyId) {
    try {
      const [answers] = await db.execute(
        `SELECT ea.answer_id, ea.answer_text, ea.validation_status,ea.validated_by,
                sr.student_id, u.name AS student_name ,q.question_text,c.title
         FROM Exam_Answers ea
         JOIN Student_Course_Registration sr ON ea.registration_id = sr.registration_id
         JOIN Users u ON sr.student_id = u.user_id
         JOIN questions q on ea.question_id = q.question_id
         JOIN courses c on c.id = sr.course_id
         WHERE ea.validated_by = ?`,
        [facultyId]
      );
      return answers;
    } catch (error) {
      console.error('Error retrieving answers by faculty:', error);
      throw error;
    }
  }
  
};


