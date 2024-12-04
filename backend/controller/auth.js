const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Signup Controller
exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, role = 'Student', password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const userDetails = { name, email, role, password: hashedPassword };

        const result = await User.save(userDetails);
        res.status(201).json({ message: 'User Registered!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Login Controller
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.find(email);
        if (user[0].length !== 1) {
            return res.status(401).json({ message: 'A user with this email could not be found.' });
        }

        const storedUser = user[0][0];
        const isEqual = await bcrypt.compare(password, storedUser.password);

        if (!isEqual) {
            return res.status(401).json({ message: 'Wrong password!' });
        }

        const token = jwt.sign(
          { email: storedUser.email, userId: storedUser.user_id, role: storedUser.role, name: storedUser.name },
          process.env.JWT_SECRET || 'your_jwt_secret', // Use environment variable
          { expiresIn: '1h' }
      );

        res.status(200).json({ token, userId: storedUser.user_id, role: storedUser.role, name: storedUser.name });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Create Faculty Controller
exports.createFaculty = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const facultyDetails = { name, email, password: hashedPassword, role: 'Faculty' };

        const result = await User.createFaculty(facultyDetails);
        res.status(201).json({ message: 'Faculty Member Created!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Get Faculty Details Controller
exports.getFacultyDetails = async (req, res, next) => {
    try {
        const faculty = await User.findByRole(roleId);
        res.status(200).json(faculty[0]);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
