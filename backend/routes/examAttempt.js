const express = require('express');
const { body } = require('express-validator');
const examAttemptController = require('../controller/examAttempt');

const router = express.Router();

router.get('/', examAttemptController.getAllExamAttempts);
router.get('/:studentId', examAttemptController.getExamAttemptsByStudentId);

router.post(
    '/',
    [
        body('studentId').isInt().withMessage('Student ID is required'),
        body('assignmentId').isInt().withMessage('Assignment ID is required'),
        body('attemptDate').isISO8601().withMessage('Attempt date must be a valid date'),
    ],
    examAttemptController.createExamAttempt
);

router.delete('/:attemptId', examAttemptController.deleteExamAttempt);

module.exports = router;
