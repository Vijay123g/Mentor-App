const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const authController = require('../controller/auth');


router.post(
    '/signup',
    [
        body('name').trim().not().isEmpty(),
        body('email').isEmail().withMessage('please enter correct email address  !')
        .custom(async (email) => 
        {
            const user = await User.find(email);
            if (user[0].length > 0) {
                return Promise.reject('email address already exists please login !');
            }
        })
        .normalizeEmail(),
        body('role').trim().not().isEmpty(),
        body('password').trim().isLength({min : 8}),
        
    ],
    authController.signup
);

router.post('/login', authController.login);

module.exports = router;