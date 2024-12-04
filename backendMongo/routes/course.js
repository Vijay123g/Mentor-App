const express = require('express');
const { body } = require('express-validator');
const courseController = require('../controller/course')

const router = express.Router();

router.get('/', courseController.getAllCourses);
router.get('/:courseId', courseController.getCourseById);

router.post(
  '/',
  [
    body('courseName').notEmpty().withMessage('Course name is required'),
    body('semester').isInt({ gt: 0 }).withMessage('Semester must be a positive integer')
  ],
  courseController.createCourse
);

router.put(
  '/:courseId',
  [
    body('courseName').notEmpty().withMessage('Course name is required'),
    body('semester').isInt({ gt: 0 }).withMessage('Semester must be a positive integer')
  ],
  courseController.updateCourse
);

router.delete('/:courseId', courseController.deleteCourse);

module.exports = router;
