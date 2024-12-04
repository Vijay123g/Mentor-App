const express = require('express');
const { body } = require('express-validator');
const questionController = require('../controller/question');

const router = express.Router();

router.get('/', questionController.getAllQuestions);
router.get('/:questionId', questionController.getQuestionById);

router.post(
    '/',
    [
        body('courseId').isInt().withMessage('Course ID is required'),
        body('facultyId').isInt().withMessage('Faculty ID is required'),
        body('questionText').notEmpty().withMessage('Question text is required')
    ],
    questionController.createQuestion
);

router.put(
    '/:questionId',
    [
        body('courseId').isInt().withMessage('Course ID is required'),
        body('facultyId').isInt().withMessage('Faculty ID is required'),
        body('questionText').notEmpty().withMessage('Question text is required')
    ],
    questionController.updateQuestion
);

router.delete('/:questionId', questionController.deleteQuestion);

router.get('/questions/:facultyId/:courseId', questionController.getQuestionsByFacultyAndCourse);



module.exports = router;
