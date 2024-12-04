const db = require('../connection/database');

class Course {
    constructor(courseName, description, semester) {
        this.courseName = courseName;
        this.description = description;
        this.semester = semester;
    }

    static async getAllCourses() {
        return db.execute('SELECT * FROM Courses');
    }

    static async getCourseById(courseId) {
        return db.execute(`SELECT c.*, u.name AS faculty_name 
FROM Courses c
LEFT JOIN FacultyCourses fc ON c.course_id = fc.course_id
LEFT JOIN Users u ON u.user_id = fc.faculty_id
WHERE c.course_id = ?;
`, [courseId]);
    }

    static async createCourse(course) {
        const { courseName, description, semester,slots_avilable ,location ,Timings } = course;
        return db.execute(
            'INSERT INTO Courses (course_name, description, semester , slots_avilable,location,Timings) VALUES (?, ?, ? ,?,?,?)',
            [courseName, description, semester,slots_avilable ,location ,Timings ]
        );
    }

    static async updateCourse(courseId, courseData) {
        const { courseName, description, semester,slots_avilable ,location ,Timings } = courseData;
        return db.execute(
            'UPDATE Courses SET course_name = ?, description = ?, semester = ? ,slots_avilable =?,location = ?,Timings = ? WHERE course_id = ?',
            [courseName, description, semester,slots_avilable ,location ,Timings,courseId]
        );
    }

    static async deleteCourse(courseId) {
        return db.execute('DELETE FROM Courses WHERE course_id = ?', [courseId]);
    }
}

module.exports = Course;
