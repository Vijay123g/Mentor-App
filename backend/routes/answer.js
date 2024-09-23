const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const answerController = require('../controller/answer');

router.post(
  '/answer',
  [
    body('registrationId').isInt().withMessage('Registration ID is required and must be an integer'),
    body('questionId').isInt().withMessage('Question ID is required and must be an integer'),
    body('answerText').notEmpty().withMessage('Answer text is required'),
    body('validatedBy').isInt().withMessage('Faculty ID is required and must be an integer'),
  ],
  answerController.submitAnswer
);

router.put('/answer/validate', [
  body('answerId').isInt().withMessage('Answer ID is required and must be an integer'),
  body('validatedBy').isInt().withMessage('Validator ID is required and must be an integer'),
  body('validationStatus').isBoolean().withMessage('Validation status must be a boolean'),
], answerController.validateAnswer);

module.exports = router;

router.get('/answers/status/:registrationId', answerController.getAnswerStatus);

router.get('/faculty/:courseId', answerController.getFacultyByCourse);

router.get('/answers/student/:studentId', answerController.getAnswersByStudent);

router.get('/faculty/:facultyId/answers', answerController.getAnswersForFaculty);

