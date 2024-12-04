const express = require('express');
const { body } = require('express-validator');
const facultyCourseController = require('../controller/facultyCourse');

const router = express.Router();

router.post(
  '/assign',
  [
    body('facultyId').isInt(),
    body('courseId').isInt()
  ],
  facultyCourseController.assignCourse
);

// Get courses assigned to a specific faculty
router.get('/:facultyId/courses', facultyCourseController.getCoursesForFaculty);

// Get all assigned courses with faculty details
router.get('/all/assigned-courses', facultyCourseController.getAllAssignedCourses);

// Get courses assigned to a specific faculty with faculty details
router.get('/:facultyId/assigned-courses', facultyCourseController.getAssignedCoursesByFaculty);

router.get('/faculty-course-assignments', facultyCourseController.getFacultyCourseAssignments);

module.exports = router;
