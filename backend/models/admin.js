const db = require('../connection/database');
const bcrypt = require('bcrypt');

module.exports = class User {
    constructor(name, email, password, mobile) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.mobile = mobile;
    }

    static async save(user) {
        const { name, email, password, mobile, roles } = user;
        const [result] = await db.execute(
            'INSERT INTO Users (name, email, password, mobile) VALUES (?, ?, ?, ?)',
            [name, email, password, mobile]
        );

        const userId = result.insertId;
        for (const role of roles) {
            const [roleData] = await db.execute('SELECT role_id FROM Roles WHERE role_name = ?', [role]);
            if (roleData.length) {
                await db.execute('INSERT INTO UserRoles (user_id, role_id) VALUES (?, ?)', [userId, roleData[0].role_id]);
            }
        }
        return result;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute(
            `SELECT u.user_id, u.name, u.email, u.password, u.mobile, 
            GROUP_CONCAT(r.role_name) AS roles
            FROM Users u 
            LEFT JOIN UserRoles ur ON u.user_id = ur.user_id
            LEFT JOIN Roles r ON ur.role_id = r.role_id
            WHERE u.email = ? GROUP BY u.user_id`,
            [email]
        );
        return rows[0];
    }

    static async findById(userId) {
        const [rows] = await db.execute(
            `SELECT u.user_id, u.name, u.email, u.profile, u.mobile, 
            GROUP_CONCAT(r.role_name) AS roles
            FROM Users u
            LEFT JOIN UserRoles ur ON u.user_id = ur.user_id
            LEFT JOIN Roles r ON ur.role_id = r.role_id
            WHERE u.user_id = ? GROUP BY u.user_id`,
            [userId]
        );
        return rows[0];
    }

    static async update(userId, updatedData) {
        const { name, profile, mobile } = updatedData;
        const [result] = await db.execute(
            'UPDATE Users SET name = ?, profile = ?, mobile = ? WHERE user_id = ?',
            [name, profile, mobile, userId]
        );
        return result.affectedRows > 0;
    }

    static async delete(userId) {
        const [result] = await db.execute('DELETE FROM Users WHERE user_id = ?', [userId]);
        return result.affectedRows > 0;
    }

    static async findByRole(roleId) {
        const [rows] = await db.execute(
            `SELECT u.user_id, u.name, u.email, u.mobile
             FROM UserRoles as ur
             JOIN Users as u ON u.user_id = ur.user_id
             WHERE ur.role_id = ?`,
            [roleId]
        );
        return rows;
    }

    
    static async countByRole(roleId) {
        const [result] = await db.execute(
            `SELECT COUNT(u.email) as count 
             FROM UserRoles as ur 
             JOIN Users as u ON u.user_id = ur.user_id 
             WHERE ur.role_id = ?`,
            [roleId]
        );
        return result[0].count;
    }

    static async saveOtp(email, otp) {
        await db.execute(
            'INSERT INTO OTPs (email, otp, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))',
            [email, otp]
        );
    }

    static async findOtpByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM OTPs WHERE email = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
            [email]
        );
        return rows[0]; // Return the actual OTP record
    }
    

    static async deleteOtp(email) {
        await db.execute('DELETE FROM OTPs WHERE email = ?', [email]);
    }
};
