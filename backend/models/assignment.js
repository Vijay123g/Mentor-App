const db = require('../connection/database');

class Assignment {
    constructor(courseId, facultyId, assignmentName, expiryDate) {
        this.courseId = courseId;
        this.facultyId = facultyId;
        this.assignmentName = assignmentName;
        this.expiryDate = expiryDate;
    }

    // Get all assignments with course and faculty details
    static async getAll() {
        return db.execute(`
            SELECT a.*, c.course_name, u.name AS faculty_name 
            FROM Assignments a
            JOIN Courses c ON a.course_id = c.course_id
            JOIN Users u ON a.faculty_id = u.user_id
        `);
    }

    // Get assignment by ID
    static async getById(assignmentId) {
        return db.execute(`
            SELECT a.*, c.course_name, u.name AS faculty_name 
            FROM Assignments a
            JOIN Courses c ON a.course_id = c.course_id
            JOIN Users u ON a.faculty_id = u.user_id
            WHERE a.assignment_id = ?
        `, [assignmentId]);
    }

    // Create a new assignment
    static async create(assignment) {
        const { courseId, facultyId, assignmentName, expiryDate } = assignment;
        return db.execute(
            `INSERT INTO Assignments (course_id, faculty_id, assignment_name, expiry_date) 
             VALUES (?, ?, ?, ?)`,
            [courseId, facultyId, assignmentName, expiryDate]
        );
    }

    // Update an existing assignment
    static async update(assignmentId, assignmentData) {
        const { courseId, facultyId, assignmentName, expiryDate } = assignmentData;
        return db.execute(
            `UPDATE Assignments 
             SET course_id = ?, faculty_id = ?, assignment_name = ?, expiry_date = ? 
             WHERE assignment_id = ?`,
            [courseId, facultyId, assignmentName, expiryDate, assignmentId]
        );
    }

    // Delete an assignment
    static async delete(assignmentId) {
        return db.execute('DELETE FROM Assignments WHERE assignment_id = ?', [assignmentId]);
    }

    // Get assignments by faculty and course
    static async getAssignmentsByFacultyAndCourse(facultyId, courseId) {
        return db.execute(`
            SELECT a.*, c.course_name, u.name AS faculty_name 
            FROM Assignments a
            JOIN Courses c ON a.course_id = c.course_id
            JOIN Users u ON a.faculty_id = u.user_id
            WHERE a.faculty_id = ? AND a.course_id = ?`,
            [facultyId, courseId]
        );
    }

    // Get assignments near expiry
    static async getExpiringAssignments(days) {
        return db.execute(`
            SELECT a.*, c.course_name, u.name AS faculty_name 
            FROM Assignments a
            JOIN Courses c ON a.course_id = c.course_id
            JOIN Users u ON a.faculty_id = u.user_id
            WHERE DATEDIFF(a.expiry_date, CURDATE()) <= ?
        `, [days]);
    }
}

module.exports = Assignment;
