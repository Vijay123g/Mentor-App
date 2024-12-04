const db = require('../connection/database');

class Question {
    constructor(courseId, facultyId, questionText) {
        this.courseId = courseId;
        this.facultyId = facultyId;
        this.questionText = questionText;
    }

    static async getAll() {
        return db.execute(`SELECT q.*, c.course_name, u.name AS faculty_name 
FROM Questions q
JOIN Courses c ON q.course_id = c.course_id
JOIN Users u ON q.faculty_id = u.user_id`);
    }

    static async getById(questionId) {
        return db.execute(`SELECT q.*, c.course_name, u.name AS faculty_name 
FROM Questions q
JOIN Courses c ON q.course_id = c.course_id
JOIN Users u ON q.faculty_id = u.user_id
WHERE q.question_id = ?`, [questionId]);
    }

    static async create(question) {
        const { courseId, facultyId, questionText } = question;
        return db.execute(
            'INSERT INTO Questions (course_id, faculty_id, question_text) VALUES (?, ?, ?)',
            [courseId, facultyId, questionText]
        );
    }

    static async update(questionId, questionData) {
        const { courseId, facultyId, questionText } = questionData;
        return db.execute(
            'UPDATE Questions SET course_id = ?, faculty_id = ?, question_text = ? WHERE question_id = ?',
            [courseId, facultyId, questionText, questionId]
        );
    }

    static async delete(questionId) {
        return db.execute('DELETE FROM Questions WHERE question_id = ?', [questionId]);
    }

    static async getQuestionsByFacultyAndCourse(facultyId, courseId) {
        return db.execute(
            `SELECT q.*, c.course_name, u.name AS faculty_name 
FROM Questions q
JOIN Courses c ON q.course_id = c.course_id
JOIN Users u ON q.faculty_id = u.user_id
WHERE q.faculty_id = ? AND q.course_id = ?`,
            [facultyId, courseId]
        );
    }
}



module.exports = Question;
