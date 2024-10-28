const { validationResult } = require('express-validator');
const Registration = require('../models/registration');

exports.registerStudent = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { studentId, courseId } = req.body;

  try {
    const result = await Registration.save({ studentId, courseId });

    if (result) {
      res.status(201).json({ message: 'Student registered for the course successfully!' });
    } else {
      res.status(500).json({ message: 'Failed to register student for the course' });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getRegistrationsByStudent = async (req, res, next) => {
  const studentId = req.params.studentId;

  try {
    const registrations = await Registration.findByStudentId(studentId);

    if (registrations.length > 0) {
      res.status(200).json({ registrations });
    } else {
      res.status(404).json({ message: 'No registrations found for this student.' });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getRegistrationsByCourse = async (req, res, next) => {
  const courseId = req.params.courseId;

  try {
    const registrations = await Registration.findByCourseId(courseId);

    if (registrations.length > 0) {
      res.status(200).json({ registrations });
    } else {
      res.status(404).json({ message: 'No registrations found for this course.' });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.unregisterStudent = async (req, res, next) => {
  const registrationId = req.params.registrationId;

  try {
    const result = await Registration.delete(registrationId);

    if (result) {
      res.status(200).json({ message: 'Student unregistered from the course successfully!' });
    } else {
      res.status(404).json({ message: 'Registration not found.' });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getDetailedRegistrationsByStudent = async (req, res, next) => {
  const studentId = req.params.studentId;

  try {
    const registrations = await Registration.findRegistrationsWithDetailsByStudentId(studentId);

    if (registrations.length > 0) {
      res.status(200).json({ registrations });
    } else {
      res.status(404).json({ message: 'No detailed registrations found for this student.' });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};