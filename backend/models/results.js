const db = require('../connection/database');

class Result {
    constructor(attemptId, totalScore, passed) {
        this.attemptId = attemptId;
        this.totalScore = totalScore;
        this.passed = passed;
    }

    static async getAll() {
        return db.execute(`SELECT r.*, ea.student_id, ea.assignment_id, u.name AS student_name, a.assignment_name 
FROM Results r
JOIN ExamAttempts ea ON r.attempt_id = ea.attempt_id
JOIN Users u ON ea.student_id = u.user_id
JOIN Assignments a ON ea.assignment_id = a.assignment_id;
`);
    }

    static async getByAttemptId(attemptId) {
        return db.execute(`SELECT r.*, ea.student_id, ea.assignment_id, u.name AS student_name 
FROM Results r
JOIN ExamAttempts ea ON r.attempt_id = ea.attempt_id
JOIN Users u ON ea.student_id = u.user_id
WHERE r.attempt_id = ?;
`, [attemptId]);
    }

    static async create(result) {
        const { attemptId, totalScore, passed } = result;
        return db.execute(
            'INSERT INTO Results (attempt_id, total_score, passed) VALUES (?, ?, ?)',
            [attemptId, totalScore, passed]
        );
    }

    static async update(resultId, updatedFields) {
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(updatedFields)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }

        values.push(resultId);
        const query = `UPDATE Results SET ${fields.join(', ')} WHERE result_id = ?`;
        return db.execute(query, values);
    }

    static async delete(resultId) {
        return db.execute('DELETE FROM Results WHERE result_id = ?', [resultId]);
    }
}

module.exports = Result;
