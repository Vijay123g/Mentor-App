const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User} = require('../model/admin');
const { validationResult } = require('express-validator');
const transporter = require('../middleware/transporter');



exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password, mobile, roles } = req.body;

    try {
        const user = await User.createUser({ name, email, password, mobile, roles });
        res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Failed to register user', error: error.message });
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

        const token = jwt.sign({ userId: user._id, roles: user.roles }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ token, userId: user._id, role: user.roles });
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
    const { role } = req.params;

    try {
        console.log(`Fetching users with role: ${role}`);
        const users = await User.findByRole(role);

        if (!users || users.length === 0) {
            return res.status(404).json({ message: `No users found with role: ${role}` });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getUsersByRole:', error);
        next(error);
    }
};

exports.getCountByRole = async (req, res, next) => {
    const { role } = req.params; 
    try {
        const count = await User.countByRole(role); 
        res.status(200).json({ role, count });
    } catch (error) {
        next(error);
    }
};


    

const { OTP } = require('../model/admin');

exports.generateOtp = async (req, res, next) => {
    const { email } = req.body;

    try {
        const otp = Math.floor(100000 + Math.random() * 900000); 
        await OTP.saveOtp(email, otp); 

        await transporter.sendMail({
            from: '"Mentor App" <vijay.g.18.04.1999@gmail.com>',
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
        const savedOTP = await OTP.findOtpByEmail(email); 

        if (!savedOTP || parseInt(savedOTP.otp, 10) !== parseInt(otp, 10)) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        
        await OTP.deleteOtp(email); 

        const user = await User.findByEmail(email); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

    
        const token = jwt.sign({ userId: user._id, roles: user.roles }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).json({ token, userId: user._id, role: user.roles });
    } catch (error) {
        res.status(500).json({ message: 'OTP verification failed', error: error.message });
    }
};





