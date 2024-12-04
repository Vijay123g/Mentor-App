// const express = require('express');

// const { body } = require('express-validator');

// const router = express.Router();

// const User = require('../models/user');

// const authController = require('../controller/auth');


// router.post(
//     '/signup',
//     [
//         body('name').trim().not().isEmpty(),
//         body('email').isEmail().withMessage('please enter correct email address  !')
//         .custom(async (email) => 
//         {
//             const user = await User.find(email);
//             if (user[0].length > 0) {
//                 return Promise.reject('email address already exists please login !');
//             }
//         })
//         .normalizeEmail(),
//         body('role').trim().not().isEmpty(),
//         body('password').trim().isLength({min : 8}),
        
//     ],
//     authController.signup
// );

// router.post('/login', authController.login);

// module.exports = router;

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};
