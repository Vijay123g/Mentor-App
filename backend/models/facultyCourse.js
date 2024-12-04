const db = require('../connection/database');

module.exports = class FacultyCourse {
  static async assignCourseToFaculty(facultyId, courseId) {
    try {
      const [result] = await db.execute(
        'INSERT INTO FacultyCourses (faculty_id, course_id) VALUES (?, ?)',
        [facultyId, courseId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getCoursesByFaculty(facultyId) {
    try {
      const [courses] = await db.execute(
        `SELECT c.*, u.name AS faculty_name 
FROM Courses c 
JOIN FacultyCourses fc ON c.course_id = fc.course_id 
JOIN Users u ON u.user_id = fc.faculty_id
WHERE fc.faculty_id = ?;
`,
        [facultyId]
      );
      return courses;
    } catch (error) {
      throw error;
    }
  }

  // Get all assigned courses with faculty details
  static async getAllAssignedCourses() {
    try {
      const [courses] = await db.execute(
        `SELECT fc.*, c.*, u.*
         FROM FacultyCourses fc
         JOIN Courses c ON fc.course_id = c.course_id
         JOIN Users u ON u.user_id = fc.faculty_id`
      );
      return courses;
    } catch (error) {
      throw error;
    }
  }

  // Get assigned courses for a specific faculty
  static async getAssignedCoursesByFaculty(facultyId) {
    try {
      const [courses] = await db.execute(
        `SELECT fc.*, c.*, u.*
         FROM FacultyCourses fc
         JOIN Courses c ON fc.course_id = c.course_id
         JOIN Users u ON u.user_id = fc.faculty_id
         WHERE fc.faculty_id = ?`,
        [facultyId]
      );
      return courses;
    } catch (error) {
      throw error;
    }
  }

  static async getFacultyCourseAssignments() {
    try {
      const [results] = await db.execute(`
        SELECT fc.*, c.*, u.name AS faculty_name 
FROM FacultyCourses fc 
JOIN Courses c ON c.course_id = fc.course_id 
JOIN Users u ON u.user_id = fc.faculty_id;

      `);
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async assignCourseToFaculty(facultyId, courseId) {
    const [existing] = await db.execute(
        'SELECT * FROM FacultyCourses WHERE faculty_id = ? AND course_id = ?',
        [facultyId, courseId]
    );
    if (existing.length > 0) {
        throw new Error('This course is already assigned to the faculty.');
    }
    return db.execute('INSERT INTO FacultyCourses (faculty_id, course_id) VALUES (?, ?)', [facultyId, courseId]);
}

};
