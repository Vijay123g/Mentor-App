const db = require('../connection/database');

class Registration {
    constructor(studentId, facultyCourseId, registrationDate) {
        this.studentId = studentId;
        this.facultyCourseId = facultyCourseId;
        this.registrationDate = registrationDate;
    }

    // Fetch all registrations
    static async getAll() {
        return db.execute(`
            SELECT r.registration_id, r.student_id, fc.faculty_course_id, 
                   c.course_name, c.slots_avilable, 
                   GROUP_CONCAT(DISTINCT u.name SEPARATOR ', ') AS instructor_names
            FROM Registrations r
            JOIN facultycourses fc ON r.faculty_course_id = fc.faculty_course_id
            JOIN Courses c ON fc.course_id = c.course_id
            JOIN Users u ON fc.faculty_id = u.user_id
            GROUP BY r.registration_id, r.student_id, fc.faculty_course_id, c.course_name, c.slots_avilable
        `);
    }

    // Fetch registrations by a specific student ID
    static async getByStudentId(studentId) {
        return db.execute(`
           SELECT 
    r.registration_id, 
    r.student_id, 
    fc.faculty_course_id,
    c.course_name, 
    c.slots_avilable,
    GROUP_CONCAT(DISTINCT u.name SEPARATOR ', ') AS instructor_names,
    GROUP_CONCAT(DISTINCT a.assignment_id SEPARATOR ', ') AS assignment_ids,
    GROUP_CONCAT(DISTINCT a.assignment_name SEPARATOR ', ') AS assignment_names
FROM 
    Registrations r
JOIN 
    facultycourses fc ON r.faculty_course_id = fc.faculty_course_id
JOIN 
    Courses c ON fc.course_id = c.course_id
JOIN 
    Users u ON fc.faculty_id = u.user_id
LEFT JOIN 
    assignments a ON a.faculty_id = fc.faculty_id
WHERE 
    r.student_id = ?
GROUP BY 
    r.registration_id, 
    r.student_id, 
    fc.faculty_course_id, 
    c.course_name, 
    c.slots_avilable;

        `, [studentId]);
    }

    // Create a new registration
    static async create(registration) {
        const { studentId, facultyCourseId, registrationDate } = registration;

        // Validate input
        if (!studentId || !facultyCourseId || !registrationDate) {
            throw new Error('Missing required fields: studentId, facultyCourseId, or registrationDate');
        }

        // Check if the course is already registered by the student
        const [existing] = await db.execute(`
            SELECT * FROM Registrations WHERE student_id = ? AND faculty_course_id = ?
        `, [studentId, facultyCourseId]);

        if (existing.length > 0) {
            throw new Error('Course already registered by the student.');
        }

        // Insert new registration
        await db.execute(`
            INSERT INTO Registrations (student_id, faculty_course_id, registration_date)
            VALUES (?, ?, ?)
        `, [studentId, facultyCourseId, registrationDate]);

        // Reduce available slots
        await db.execute(`
            UPDATE Courses 
            JOIN facultycourses fc ON Courses.course_id = fc.course_id 
            SET Courses.slots_avilable = Courses.slots_avilable - 1 
            WHERE fc.faculty_course_id = ?
        `, [facultyCourseId]);

        return { message: 'Registration successful.' };
    }

    // Delete a registration
    static async delete(registrationId) {
        // Fetch the faculty_course_id to update slots correctly
        const [registration] = await db.execute(`
            SELECT faculty_course_id FROM Registrations WHERE registration_id = ?
        `, [registrationId]);

        if (!registration.length) {
            throw new Error('Registration not found.');
        }

        const facultyCourseId = registration[0].faculty_course_id;

        // Delete the registration
        await db.execute(`
            DELETE FROM Registrations WHERE registration_id = ?
        `, [registrationId]);

        // Increase available slots
        await db.execute(`
            UPDATE Courses 
            JOIN facultycourses fc ON Courses.course_id = fc.course_id 
            SET Courses.slots_avilable = Courses.slots_avilable + 1 
            WHERE fc.faculty_course_id = ?
        `, [facultyCourseId]);

        return { message: 'Successfully dropped course.' };
    }
}

module.exports = Registration;
