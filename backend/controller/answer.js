
const { validationResult } = require('express-validator');
const Answer = require('../models/answer');

exports.submitAnswer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { registrationId, questionId, answerText, validatedBy } = req.body;

  try {
    const courseId = await Answer.getCourseIdByQuestion(questionId);
    const facultyId = await Answer.getFacultyIdByCourse(courseId);

    if (!facultyId) {
      return res.status(404).json({ message: 'No faculty found for this courses.' });
    }
  
    const result = await Answer.submitAnswer({ registrationId, questionId, answerText, validatedBy: facultyId, validationStatus: false });
    res.status(201).json({ message: 'Answer submitted successfully!' });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getAnswerStatus = async (req, res, next) => {
  const { registrationId } = req.params;

  try {
    const answers = await Answer.getAnswersByRegistration(registrationId);

    if (answers) {
      res.status(200).json({ answers });
    } else if (answers.length > 0) {
      res.status(200).json({ status: 'waiting', message: 'Waiting for results or validation.' });
    } else {
      res.status(404).json({ message: 'No answers found for this registration.' });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.validateAnswer = async (req, res, next) => {
  console.log('request recieved',req.body);
  const { answerId} = req.body;
  const validatedBy = req.body.validatedBY;
  const validationStatus = req.body.validationStatus;

  console.log( 'assigned values',validatedBy)

  try {
    const result = await Answer.validateAnswer(answerId, validatedBy, validationStatus);
    res.status(200).json({ message: 'Answer validated successfully!' });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getFacultyByCourse = async (req, res, next) => {
  const courseId = req.params.courseId;
  console.log('Received courseId:', courseId);

  try {
    const facultyId = await Answer.getFacultyIdByCourse(courseId);

    if (facultyId) {
      res.status(200).json({ facultyId });
    } else {
      res.status(404).json({ message: 'No faculty found for this course.' });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getAnswersByStudent = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const answers = await Answer.getAnswersByStudent(studentId);
    const allValidated = answers.every(answer => answer.validation_status === true);

    res.status(200).json({
      answers,
      allValidated
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getAnswersForFaculty = async (req, res, next) => {
  const { facultyId } = req.params;

  try {
    const answers = await Answer.getAnswersByFaculty(facultyId);

    if (answers) {
      res.status(200).json({ answers });
    } else {
      res.status(404).json({ message: 'No answers found for this faculty.' });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

