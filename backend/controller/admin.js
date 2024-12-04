const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/admin');
const transporter = require('../middleware/transporter'); 


exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { name, email, password, mobile, roles } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.save({ name, email, password: hashedPassword,mobile, roles });
        
        res.status(201).json({ message: 'User registered successfully', userId: user.insertId });
    } catch (error) {
        next(error);
    }
};

// exports.login = async (req, res, next) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findByEmail(email);
//         if (!user) return res.status(401).json({ message: 'User not found' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

//         const token = jwt.sign({ userId: user.user_id, roles: user.roles }, 'your_jwt_secret', { expiresIn: '1h' });
//         res.status(200).json({ token, userId: user.user_id });
//     } catch (error) {
//         next(error);
//     }
// };


exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) return res.status(401).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

        const token = jwt.sign({ userId: user.user_id, roles: user.roles }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ token, userId: user.user_id, role: user.roles });
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    const { userId } = req.params;
    const { name, profile, mobile } = req.body;

    try {
        const updated = await User.update(userId, { name, profile, mobile });
        if (!updated) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (user.roles.includes('Admin')) return res.status(403).json({ message: 'Cannot delete admin user' });

        const result = await User.delete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getUsersByRole = async (req, res, next) => {
    const { roleId } = req.params;
    try {
        const users = await User.findByRole(roleId);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

exports.getCountByRole = async (req, res, next) => {
    const { roleId } = req.params;
    try {
        const count = await User.countByRole(roleId);
        res.status(200).json({ count });
    } catch (error) {
        next(error);
    }
};
    

exports.generateOtp = async (req, res, next) => {
    const { email } = req.body;

    try {
        const otp = Math.floor(100000 + Math.random() * 900000); 
        await User.saveOtp(email, otp);

        await transporter.sendMail({
            from: '"Mentor App" <vijay.g.18.04.1999@gmail.com   >', 
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`,
        });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};


exports.verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;

    try {
        const savedOTP = await User.findOtpByEmail(email);

        if (!savedOTP || parseInt(savedOTP.otp, 10) !== parseInt(otp, 10)) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Delete OTP after successful verification
        await User.deleteOtp(email);

        const user = await User.findByEmail(email); // Fetch the actual user

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user.user_id, roles: user.roles }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).json({ token, userId: user.user_id, role: user.roles });
    } catch (error) {
        res.status(500).json({ message: 'OTP verification failed', error: error.message });
    }
};




