const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const registrationController = require('../controller/registration');


router.post(
  '/register',
  [
    body('studentId').isInt().withMessage('Invalid student ID.'),
    body('courseId').isInt().withMessage('Invalid course ID.'),
  ],
  registrationController.registerStudent
);

router.get('/registrations/student/:studentId', registrationController.getRegistrationsByStudent);

router.get('/registrations/course/:courseId', registrationController.getRegistrationsByCourse);

router.delete('/unregister/:registrationId', registrationController.unregisterStudent);

router.get(
  '/detailed-registrations/student/:studentId',registrationController.getDetailedRegistrationsByStudent)

module.exports = router;
