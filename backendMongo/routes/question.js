const express = require('express');
const { body } = require('express-validator');
const questionController = require('../controller/question');

const router = express.Router();

router.get('/', questionController.getAllQuestions);
router.get('/:questionId', questionController.getQuestionById);

router.post(
    '/',
    [
        body('courseId').notEmpty().withMessage('Course ID is required'),
        body('facultyId').notEmpty().withMessage('Faculty ID is required'),
        body('questionText').notEmpty().withMessage('Question text is required'),
    ],
    questionController.createQuestion
);

router.put(
    '/:questionId',
    [
        body('courseId').notEmpty().withMessage('Course ID is required'),
        body('facultyId').notEmpty().withMessage('Faculty ID is required'),
        body('questionText').notEmpty().withMessage('Question text is required'),
    ],
    questionController.updateQuestion
);

router.delete('/:questionId', questionController.deleteQuestion);

router.get('/faculty/:facultyId/course/:courseId', questionController.getQuestionsByFacultyAndCourse);

module.exports = router;
