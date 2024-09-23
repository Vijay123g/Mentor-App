const { validationResult } = require('express-validator');
const Question = require('../models/question');

exports.createQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { courseId, facultyId, questionText } = req.body;

  try {
    const result = await Question.createQuestion({ courseId, facultyId, questionText });
    res.status(201).json({ message: 'Question created successfully!' });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getQuestionsByCourse = async (req, res, next) => {
  const courseId = req.params.courseId;

  try {
    const questions = await Question.getQuestionsByCourse(courseId);
    res.status(200).json({ questions });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getQuestionsByFaculty = async (req, res, next) => {
  const facultyId = req.params.faculty_id ;
  const course_id =req.params.course_id;

  try {
    const questions = await Question.getQuestionsByFaculty(course_id,facultyId );
    res.status(200).json({ questions });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
