const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const questionController = require('../controller/question');

router.post(
  '/question',
  [
    body('courseId').isInt().withMessage('Course ID is required and must be an integer'),
    body('facultyId').isInt().withMessage('Faculty ID is required and must be an integer'),
    body('questionText').notEmpty().withMessage('Question text is required'),
  ],
  questionController.createQuestion
);

router.get('/question/:courseId', questionController.getQuestionsByCourse);

router.get('/faculty/:course_id/:faculty_id', questionController.getQuestionsByFaculty);



router.get('/test', (req, res, next) => {
  console.log('Test route hit');
  res.status(200).json({ message: 'Test route working' });
});


module.exports = router;
