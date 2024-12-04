const express = require('express');
const { body } = require('express-validator');
const assignmentQuestionController =  require('../controller/assignmentQuestion');

const router = express.Router();

router.get('/', assignmentQuestionController.getAllAssignmentQuestions);

router.get('/:assignmentId', assignmentQuestionController.getAssignmentQuestionsByAssignmentId);

router.post(
    '/',
    [
        body('assignmentId').notEmpty().withMessage('Assignment ID is required'),
        body('questionId').notEmpty().withMessage('Question ID is required'),
    ],
    assignmentQuestionController.createAssignmentQuestion
);

router.delete('/:assignmentQuestionId', assignmentQuestionController.deleteAssignmentQuestion);


router.get('/faculty/questions/:facultyId', assignmentQuestionController.getAssignmentsWithQuestionsByFaculty);

router.get('/faculty/assignments/:facultyId', assignmentQuestionController.getFacultyAssignments);

router.get('/course/:courseId', assignmentQuestionController.getAssignmentQuestionsByCourseId);

module.exports = router;
