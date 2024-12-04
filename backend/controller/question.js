const Question = require('../models/question');
const { validationResult } = require('express-validator');

exports.getAllQuestions = async (req, res, next) => {
    try {
        const [questions] = await Question.getAll();
        res.status(200).json({ questions });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.getQuestionById = async (req, res, next) => {
    const questionId = req.params.questionId;
    try {
        const [question] = await Question.getById(questionId);
        res.status(200).json({ question });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.createQuestion = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { courseId, facultyId, questionText } = req.body;

    try {
        await Question.create({ courseId, facultyId, questionText });
        res.status(201).json({ message: 'Question created successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.updateQuestion = async (req, res, next) => {
    const questionId = req.params.questionId;
    const { courseId, facultyId, questionText } = req.body;

    try {
        await Question.update(questionId, { courseId, facultyId, questionText });
        res.status(200).json({ message: 'Question updated successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.deleteQuestion = async (req, res, next) => {
    const questionId = req.params.questionId;
    try {
        await Question.delete(questionId);
        res.status(200).json({ message: 'Question deleted successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.getQuestionsByFacultyAndCourse = async (req, res) => {
    const { facultyId, courseId } = req.params;
    try {
        const [questions] = await Question.getQuestionsByFacultyAndCourse(facultyId, courseId);
        res.json({ questions });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving questions for faculty and course' });
    }
};