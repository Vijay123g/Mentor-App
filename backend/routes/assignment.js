const express = require('express');
const { body } = require('express-validator');
const assignmentController = require('../controller/assignment');

const router = express.Router();

router.get('/', assignmentController.getAllAssignments);
router.get('/:assignmentId', assignmentController.getAssignmentById);

router.post(
    '/',
    [
        body('courseId').isInt().withMessage('Course ID is required'),
        body('facultyId').isInt().withMessage('Faculty ID is required'),
        body('assignmentName').notEmpty().withMessage('Assignment name is required'),
        body('expiryDate'),
    ],
    assignmentController.createAssignment
);

router.put(
    '/:assignmentId',
    [
        body('courseId').isInt().withMessage('Course ID is required'),
        body('facultyId').isInt().withMessage('Faculty ID is required'),
        body('assignmentName').notEmpty().withMessage('Assignment name is required'),
        body('expiryDate').isISO8601().withMessage('Expiry date is required')
    ],
    assignmentController.updateAssignment
);

router.delete('/:assignmentId', assignmentController.deleteAssignment);

router.get('/assignments/:facultyId/:courseId', assignmentController.getAssignmentsByFacultyAndCourse);

module.exports = router;
