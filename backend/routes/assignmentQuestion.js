const express = require('express');
const { body } = require('express-validator');
const assignmentQuestionController = require('../controller/assignmentQuestion');

const router = express.Router();

// Get all assignment questions
router.get('/', assignmentQuestionController.getAllAssignmentQuestions);

// Get assignment questions by assignment ID
router.get('/:assignmentId', assignmentQuestionController.getAssignmentQuestionsByAssignmentId);

// Create a new assignment-question mapping
router.post(
    '/',
    [
        body('assignmentId').isInt().withMessage('Assignment ID is required'),
        body('questionId').isInt().withMessage('Question ID is required'),
    ],
    assignmentQuestionController.createAssignmentQuestion
);

// Delete an assignment-question mapping
router.delete('/:assignmentQuestionId', assignmentQuestionController.deleteAssignmentQuestion);

// Get assignments with questions for a specific faculty
router.get('/faculty/questions/:facultyId', assignmentQuestionController.getAssignmentsWithQuestionsByFaculty);

// Get assignments for a specific faculty
router.get('/faculty/assignments/:facultyId', assignmentQuestionController.getFacultyAssignments);

// Get assignment questions by course ID
router.get('/course/:courseId', assignmentQuestionController.getAssignmentQuestionsByCourseId);

module.exports = router;
