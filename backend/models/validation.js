const db = require('../connection/database');

class Validation {
    constructor(answerId, facultyId, validationDate, comments) {
        this.answerId = answerId;
        this.facultyId = facultyId;
        this.validationDate = validationDate;
        this.comments = comments;
    }

    static async getAll() {
        return db.execute('SELECT * FROM Validations');
    }

    static async getByAnswerId(answerId) {
        return db.execute('SELECT * FROM Validations WHERE answer_id = ?', [answerId]);
    }

    static async create(validation) {
        const { answerId, facultyId, validationDate, comments } = validation;
        return db.execute(
          `INSERT INTO Validations (answer_id, faculty_id, validation_date, comments)
SELECT ?, ?, ?, ?
WHERE NOT EXISTS (
    SELECT 1 FROM Validations 
    WHERE answer_id = ? AND faculty_id = ?
);
`,
            [answerId, facultyId, validationDate, comments]
        );
    }

    static async update(validationId, updatedFields) {
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(updatedFields)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }

        values.push(validationId);
        const query = `UPDATE Validations SET ${fields.join(', ')} WHERE validation_id = ?`;
        return db.execute(query, values);
    }

    static async delete(validationId) {
        return db.execute('DELETE FROM Validations WHERE validation_id = ?', [validationId]);
    }

    static async getValidationsWithAnswers() {
        const query = `
            SELECT v.*, ea.answer_text, ea.validation_status, ea.score, u.name AS faculty_name, q.question_text 
FROM Validations v
JOIN ExamAnswers ea ON v.answer_id = ea.answer_id
JOIN Questions q ON ea.question_id = q.question_id
JOIN Users u ON v.faculty_id = u.user_id
WHERE ea.validation_status = TRUE;

        `;
        return db.execute(query);
    }
}

module.exports = Validation;
