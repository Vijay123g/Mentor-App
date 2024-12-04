const express = require('express');
const { check } = require('express-validator');
const adminController = require('../controller/admin')
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/signup', [
    check('name').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
], adminController.signup);


router.post('/login', adminController.login);

router.put('/user/:userId', authMiddleware, adminController.updateUser);
router.delete('/user/:userId', authMiddleware, adminController.deleteUser);

router.get('/users/role/:role', adminController.getUsersByRole);
router.get('/users/role/:role/count', adminController.getCountByRole);

router.post('/send-otp', adminController.generateOtp);
router.post('/verify-otp', adminController.verifyOtp);

module.exports = router;
