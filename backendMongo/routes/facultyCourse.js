const express = require('express');
const { body } = require('express-validator');
const facultyCourseController = require('../controller/facultyCourse');

const router = express.Router();

router.post(
    '/assign',
    [
        body('facultyId').notEmpty().withMessage('Faculty ID is required'),
        body('courseId').notEmpty().withMessage('Course ID is required')
    ],
    facultyCourseController.assignCourse
);

router.get('/:facultyId/courses', facultyCourseController.getCoursesForFaculty);
router.get('/all/assigned-courses', facultyCourseController.getAllAssignedCourses);
router.get('/faculty-course-assignments', facultyCourseController.getFacultyCourseAssignments);


module.exports = router;
