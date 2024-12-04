const express = require('express');
const { check } = require('express-validator');
const adminController = require('../controller/admin');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Signup
router.post('/signup', [
    check('name').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
], adminController.signup);

// Login
router.post('/login', adminController.login);

// Get user by ID with authorization check
// router.get('/user/:userId', authMiddleware, adminController.getUserById);

router.put('/user/:userId', authMiddleware, adminController.updateUser);

router.delete('/user/:userId', authMiddleware, adminController.deleteUser);

router.get('/users/role/:roleId',adminController.getUsersByRole);

router.get('/users/role/:roleId/count', adminController.getCountByRole);

router.post('/send-otp', adminController.generateOtp);
router.post('/verify-otp', adminController.verifyOtp);



module.exports = router;
