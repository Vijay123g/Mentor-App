const { validationResult } = require('express-validator');
const FacultyCourse = require('../models/facultyCourse');

exports.assignCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { facultyId, courseId } = req.body;

  try {
    const result = await FacultyCourse.assignCourseToFaculty(facultyId, courseId);
    res.status(201).json({ message: 'Course assigned to faculty successfully!' });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getCoursesForFaculty = async (req, res, next) => {
  const facultyId = req.params.facultyId;

  try {
    const courses = await FacultyCourse.getCoursesByFaculty(facultyId);
    res.status(200).json({ courses });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

// Get all assigned courses with faculty details
exports.getAllAssignedCourses = async (req, res, next) => {
  try {
    const courses = await FacultyCourse.getAllAssignedCourses();
    res.status(200).json({ courses });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

// Get assigned courses and faculty details for a specific faculty
exports.getAssignedCoursesByFaculty = async (req, res, next) => {
  const facultyId = req.params.facultyId;

  try {
    const courses = await FacultyCourse.getAssignedCoursesByFaculty(facultyId);
    res.status(200).json({ courses });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getFacultyCourseAssignments = async (req, res, next) => {
  try {
    const assignments = await FacultyCourse.getFacultyCourseAssignments();
    res.status(200).json({ assignments });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
