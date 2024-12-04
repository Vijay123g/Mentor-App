const db = require('../connection/database');
const database = require('../connection/db')

class ExamAnswer {
  constructor(answer) {
    this.questionId = answer.questionId;
    this.studentId = answer.studentId;
    this.answerText = answer.answerText;
    this.validatedBy = answer.validatedBy;
    this.validationStatus = answer.validationStatus;
    this.score = answer.score;
  }

  static async create(answer) {
    return db.execute(
      `INSERT INTO ExamAnswers (question_id, student_id, answer_text, validated_by, validation_status, score, file_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        answer.questionId,
        answer.studentId,
        answer.answerText,
        answer.validatedBy || null,
        answer.validationStatus ?? false,
        answer.score ?? 0,
        answer.fileId || null
      ]
    );
  }

  static async getByStudentId(studentId) {
    return db.execute(
      `SELECT DISTINCT
        ea.student_id,
        ea.answer_text,
        ea.validation_status,
        ea.score,
        ea.file_id,
        q.question_text,
        q.question_id,
        a.assignment_name,
        c.course_name
      FROM ExamAnswers ea
      LEFT JOIN Questions q ON ea.question_id = q.question_id
      LEFT JOIN AssignmentQuestions aq ON q.question_id = aq.question_id
      LEFT JOIN Assignments a ON aq.assignment_id = a.assignment_id
      LEFT JOIN Courses c ON a.course_id = c.course_id
      WHERE ea.student_id = ?
      ORDER BY a.assignment_name, q.question_id`,
      [studentId]
    );
  }

  static async validateAnswer(answerId, validatedBy, validationStatus, score) {
    return db.execute(
      `UPDATE ExamAnswers
       SET validated_by = ?, validation_status = ?, score = ?
       WHERE answer_id = ?`,
      [validatedBy, validationStatus, score, answerId]
    );
  }

  static async getByFacultyId(facultyId) {
    return db.execute(
      `SELECT DISTINCT
        ea.answer_id,
        ea.student_id,
        ea.answer_text,
        ea.validation_status,
        q.question_id,
        ea.score,
        ea.file_id,
        q.question_text,
        a.assignment_name,
        c.course_name
      FROM ExamAnswers ea
      LEFT JOIN Questions q ON ea.question_id = q.question_id
      LEFT JOIN AssignmentQuestions aq ON q.question_id = aq.question_id
      LEFT JOIN Assignments a ON aq.assignment_id = a.assignment_id
      LEFT JOIN Courses c ON a.course_id = c.course_id
      WHERE a.faculty_id = ?
      ORDER BY c.course_name, a.assignment_name, q.question_id`,
      [facultyId]
    );
  }
}

module.exports = ExamAnswer;
