const db = require('../connection/database');

class ExamAttempt {
    constructor(studentId, assignmentId, attemptDate) {
        this.studentId = studentId;
        this.assignmentId = assignmentId;
        this.attemptDate = attemptDate;
    }

    static async getAll() {
        return db.execute(`SELECT * FROM ExamAttempts ORDER BY attempt_date DESC LIMIT ?, ?;`);
    }

    static async getByStudentId(studentId) {
        return db.execute(`SELECT ea.*, a.assignment_name 
FROM ExamAttempts ea 
JOIN Assignments a ON ea.assignment_id = a.assignment_id 
WHERE ea.student_id = ?;
`, [studentId]);
    }

    static async create(attempt) {
        const { studentId, assignmentId, attemptDate } = attempt;
        return db.execute(
            `INSERT INTO ExamAttempts (student_id, assignment_id, attempt_date)
SELECT ?, ?, ?
WHERE NOT EXISTS (
    SELECT 1 FROM ExamAttempts 
    WHERE student_id = ? AND assignment_id = ?
);
`,
            [studentId, assignmentId, attemptDate]
        );
    }

    static async delete(attemptId) {
        return db.execute('DELETE FROM ExamAttempts WHERE attempt_id = ?', [attemptId]);
    }
}

module.exports = ExamAttempt;
// const db = require('../connection/database');

// class ExamAttempt {
//     static async getAll() {
//         const [results] = await db.execute('SELECT * FROM ExamAttempts');
//         return results;
//     }

//     static async getByStudentId(studentId) {
//         const [results] = await db.execute('SELECT * FROM ExamAttempts WHERE student_id = ?', [studentId]);
//         return results;
//     }

//     static async create({ studentId, assignmentId, attemptDate }) {
//         await db.execute(
//             'INSERT INTO ExamAttempts (student_id, assignment_id, attempt_date) VALUES (?, ?, ?)',
//             [studentId, assignmentId, attemptDate]
//         );
//     }

//     static async delete(attemptId) {
//         await db.execute('DELETE FROM ExamAttempts WHERE attempt_id = ?', [attemptId]);
//     }
// }

// module.exports = ExamAttempt;
