const db = require('../connection/database');

class AssignmentQuestion {
    constructor(assignmentId, questionId) {
        this.assignmentId = assignmentId;
        this.questionId = questionId;
    }

    // Get all assignment questions
    static async getAll() {
        return db.execute(`
            SELECT aq.assignment_question_id, aq.assignment_id, aq.question_id, 
                   q.question_text, a.assignment_name, c.course_name, u.name AS faculty_name 
            FROM AssignmentQuestions aq 
            JOIN Questions q ON q.question_id = aq.question_id 
            JOIN Assignments a ON aq.assignment_id = a.assignment_id 
            JOIN Courses c ON a.course_id = c.course_id 
            JOIN Users u ON u.user_id = q.faculty_id
        `);
    }

    // Get questions by assignment ID
    static async getByAssignmentId(assignmentId) {
        return db.execute(`
            SELECT q.*, a.assignment_name
            FROM AssignmentQuestions aq 
            JOIN Questions q ON aq.question_id = q.question_id 
            JOIN Assignments a ON aq.assignment_id = a.assignment_id 
            WHERE aq.assignment_id = ?`,
            [assignmentId]
        );
    }

    // Create assignment-question link
    static async create(assignmentQuestion) {
        const { assignmentId, questionId } = assignmentQuestion;
        return db.execute(
            `INSERT INTO AssignmentQuestions (assignment_id, question_id) 
             VALUES (?, ?)`,
            [assignmentId, questionId]
        );
    }

    // Delete assignment-question link
    static async delete(assignmentQuestionId) {
        return db.execute('DELETE FROM AssignmentQuestions WHERE assignment_question_id = ?', [assignmentQuestionId]);
    }

    // Get assignments with questions grouped by faculty
    static async getAssignmentsWithQuestionsByFaculty(facultyId) {
        return db.execute(`
            SELECT a.assignment_id, a.assignment_name, c.course_name, 
                   aq.question_id, q.question_text 
            FROM Assignments a
            JOIN AssignmentQuestions aq ON a.assignment_id = aq.assignment_id
            JOIN Questions q ON aq.question_id = q.question_id 
            JOIN Courses c ON a.course_id = c.course_id
            WHERE a.faculty_id = ?
        `, [facultyId]);
    }

    // Get faculty assignments
    static async getFacultyAssignments(facultyId) {
        return db.execute(`SELECT * 
FROM Assignments 
WHERE faculty_id = ?
        `, [facultyId]);
    }

    // Get assignment questions by course ID
    static async getQuestionsByCourseId(courseId) {
        const [rows] = await db.execute(`
            SELECT aq.assignment_question_id, aq.assignment_id, aq.question_id, 
                   q.question_text, a.assignment_name, u.name AS faculty_name
            FROM AssignmentQuestions aq
            JOIN Questions q ON aq.question_id = q.question_id
            JOIN Assignments a ON aq.assignment_id = a.assignment_id
            JOIN Users u ON q.faculty_id = u.user_id
            WHERE aq.assignment_id  = ?
        `, [courseId]);
        return rows; // Return only the rows (flattened result set)
    }
    
}

module.exports = AssignmentQuestion;
