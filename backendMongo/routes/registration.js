const express = require('express');
const { body } = require('express-validator');
const registrationController = require('../controller/registration');

const router = express.Router();

router.get('/', registrationController.getAllRegistrations);


router.get('/:studentId', registrationController.getRegistrationsByStudentId);

router.post(
  '/',
  [
    body('studentId').isMongoId().withMessage('Student ID must be a valid ObjectId.'),
    body('facultyCourseId').isMongoId().withMessage('Faculty Course ID must be a valid ObjectId.'),
    body('registrationDate').isISO8601().withMessage('Registration date must be a valid date.'),
  ],
  registrationController.createRegistration
);

router.delete('/:registrationId', registrationController.deleteRegistration);

module.exports = router;
