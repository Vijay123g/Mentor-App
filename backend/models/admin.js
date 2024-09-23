const db = require('../connection/database');

module.exports = class Course {
  constructor(title, description, facultyId) {
    this.title = title;
    this.description = description;
    this.facultyId = facultyId;
  }

  static async save(course) {
    const title = course.title || null;
    const description = course.description || null;
    const facultyId = course.facultyId || null;

    try {
      const [result] = await db.execute(
        'INSERT INTO courses (title, description, facultyId) VALUES (?, ?, ?)',
        [title, description, facultyId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error saving course:', error);
      throw error;
    }
  }

  static async assignFaculty(courseId, facultyId) {
    try {
      await db.execute('UPDATE courses SET facultyId = ? WHERE id = ?', [
        facultyId,
        courseId,
      ]);

      const [faculty] = await db.execute(
        'SELECT name FROM users WHERE user_id = ? AND role = "Faculty"',
        [facultyId]
      );

      if (faculty.length === 0) {
        return null;
      }

      return faculty[0].name;
    } catch (error) {
      console.error('Error assigning faculty:', error);
      throw error;
    }
  }

  static async delete(courseId) {
    try {
      const [result] = await db.execute('DELETE FROM courses WHERE id = ?', [
        courseId,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  static async getAllCourses() {
    try {
      const [courses] = await db.execute('SELECT c.id ,c.title ,c.description, u.name FROM courses c join users u on c.facultyId = u.user_id')
      return courses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  static async findById(courseId) {
    try {
      const [courses] = await db.execute('SELECT * FROM courses WHERE id = ?', [
        courseId,
      ]);
      return courses.length > 0 ? courses[0] : null;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  }

  static async getFacultyCourses(facultyId) {
    try {
        const [courses] = await db.execute(
            'SELECT * FROM courses WHERE facultyId = ?',
            [facultyId]
        );
        return courses;
    } catch (error) {
        console.error('Error fetching faculty courses:', error);
        throw error;
    }
}

static async getRegisteredCoursesByStudent(studentId) {
  try {
      const [courses] = await db.execute(
          `SELECT courses.id, courses.title
             FROM student_course_registration 
             JOIN courses ON student_course_registration.course_id = courses.id 
             WHERE student_course_registration.student_id = ?`,
          [studentId]
      );
      console.log('Courses fetched:', courses);
      return courses;
  } catch (error) {
      console.error('Error fetching registered courses:', error);
      throw error;
  }
}

static async getAssignedCourses() {
  try {
    const [result] = await db.execute(`
      SELECT courses.title AS course_title, courses.description as course_description,users.name AS faculty_name
      FROM courses
      JOIN users ON courses.facultyId = users.user_id
    `);
    return result;
  } catch (error) {
    console.error('Error fetching assigned courses:', error);
    throw error;
  }
}

static async countCourses() {
  try {
    const [count] = await db.execute('SELECT COUNT(id) as coursesCount FROM courses');
    return count;
  } catch (error) {
    throw error;
  }
}

static async countStudent() {
  try {
    const [count] = await db.execute('SELECT COUNT(user_id) as studentCount FROM users WHERE role = "Student"');
    return count;
  } catch (error) {
    throw error;
  }
}

static async countFaculty() {
  try {
    const [count] = await db.execute('SELECT COUNT(user_id) as facultyCount FROM users WHERE role = "Faculty"');
    return count;
  } catch (error) {
    throw error;
  }
}

};

