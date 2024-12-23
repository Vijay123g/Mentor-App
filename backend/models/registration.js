const db = require('../connection/database');

module.exports = class Registration {
  constructor(studentId, courseId) {
    this.studentId = studentId;
    this.courseId = courseId;
  }

  static async save(registration) {
    const studentId = registration.studentId || null;
    const courseId = registration.courseId || null;

    try {
      const [result] = await db.execute(
        'INSERT INTO Student_Course_Registration (student_id, course_id) VALUES (?, ?)',
        [studentId, courseId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error saving registration:', error);
      throw error;
    }
  }

  static async findByStudentId(studentId) {
    try {
      const [registrations] = await db.execute(
        'SELECT * FROM Student_Course_Registration WHERE student_id = ?',
        [studentId]
      );
      return registrations;
    } catch (error) {
      console.error('Error finding registrations:', error);
      throw error;
    }
  }

  static async findByCourseId(courseId) {
    try {
      const [registrations] = await db.execute(
        'SELECT * FROM Student_Course_Registration WHERE course_id = ?',
        [courseId]
      );
      return registrations;
    } catch (error) {
      console.error('Error finding registrations:', error);
      throw error;
    }
  }

  static async delete(registrationId) {
    try {
      const [result] = await db.execute(
        'DELETE FROM Student_Course_Registration WHERE registration_id = ?',
        [registrationId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting registration:', error);
      throw error;
    }
  }

  static async findRegistrationsWithDetailsByStudentId(studentId) {
    try {
      const [results] = await db.execute(
        `SELECT *
         FROM student_course_registration AS r
         JOIN users u ON r.student_id = u.user_id
         JOIN courses c ON c.id = r.course_id
         LEFT JOIN exam_answers ea ON ea.registration_id = r.registration_id
          LEFT JOIN questions q ON q.question_id = ea.question_id
         WHERE r.student_id = ?`,
        [studentId]
      );
      return results;
    } catch (error) {
      console.error('Error fetching detailed registrations:', error);
      throw error;
    }
  }
};
