const express = require('express');
const { body } = require('express-validator');
const registrationController = require('../controller/registration');

const router = express.Router();

// Get all registrations
router.get('/', registrationController.getAllRegistrations);

// Get registrations by student ID
router.get('/:studentId', registrationController.getRegistrationsByStudentId);

// Create a new registration
router.post(
    '/',
    [
        body('studentId').isInt().withMessage('Student ID must be an integer.'),
        body('courseId').isInt().withMessage('Course ID must be an integer.'), // Use 'courseId' here
        body('registrationDate').isISO8601().withMessage('Registration date must be a valid date.')
    ],
    registrationController.createRegistration
);

// Delete a registration
router.delete('/:registrationId', registrationController.deleteRegistration);

module.exports = router;
