const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const authController = require('../controller/auth');

const adminController = require('../controller/admin');
const Course = require('../models/admin');
const User = require('../models/user');

router.post(
  '/course',
  [
    body('title').trim().not().isEmpty().withMessage('Course title is required'),
    body('description').trim(),
    body('facultyId').custom(async (facultyId) => {
        const user = await User.findById(facultyId);
      
        if (!user || user[0].length === 0) {
          console.log('User not found with ID:', facultyId);
          return Promise.reject('Invalid faculty ID.');
        }
      
        const userData = user[0][0];
      
        if (userData.role !== 'Faculty') {
          return Promise.reject('The user is not a faculty member.');
        }
      }),
      
  ],
  adminController.createCourse
);

router.post(
  '/course/assign',
  [
    body('courseId').custom(async (courseId) => {
      const course = await Course.findById(courseId);
      if (!course) {
        return Promise.reject('Course not found');
      }
    }),
    body('facultyId').custom(async (facultyId) => {
        const user = await User.findById(facultyId);
      
        if (!user || user[0].length === 0) {
          return Promise.reject('Invalid faculty ID.');
        }
      
        const userData = user[0][0]; 
      
        if (userData.role !== 'Faculty') {
          return Promise.reject('The user is not a faculty member.');
        }
      }),
      
  ],
  adminController.assignFaculty
);

router.delete(
  '/course/:courseId',
  [
    param('courseId').custom(async (courseId) => {
      const course = await Course.findById(courseId);
      if (!course) {
        return Promise.reject('Course not found');
      }
    }),
  ],
  adminController.deleteCourse
);

router.post(
    '/signup',
    [
        body('name').trim().not().isEmpty(),
        body('email').isEmail().withMessage('Please enter a valid email address!')
        .custom(async (email) => {
            const user = await User.find(email);
            if (user[0].length > 0) {
                return Promise.reject('Email address already exists!');
            }
        })
        .normalizeEmail(),
        body('password').trim().isLength({ min: 8 }),
    ],
    authController.signup
);

router.post(
    '/create-faculty',
    [
        body('name').trim().not().isEmpty(),
        body('email').isEmail().withMessage('Please enter a valid email address!')
        .custom(async (email) => {
            const user = await User.find(email);
            if (user[0].length > 0) {
                return Promise.reject('Email address already exists!');
            }
        })
        .normalizeEmail(),
        body('password').trim().isLength({ min: 8 }),
    ],
    authController.createFaculty
);

router.get('/faculty-details', authController.getFacultyDetails);

router.get('/view-course', adminController.getCourses);

router.post('/login', authController.login);

router.get('/faculty-courses/:facultyId', adminController.getFacultyCourses);

router.get('/student-courses/:studentId', adminController.getStudentCourses);

router.get('/assigned-courses', adminController.getAllAssignedCourses);

router.get('/counts', adminController.getCounts);



module.exports = router;
