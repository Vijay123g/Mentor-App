const ExamAttempt = require('../models/examAttempt');
const { validationResult } = require('express-validator');

exports.getAllExamAttempts = async (req, res, next) => {
    try {
        const attempts = await ExamAttempt.getAll();
        res.status(200).json({ attempts });
    } catch (err) {
        next(err);
    }
};

exports.getExamAttemptsByStudentId = async (req, res, next) => {
    const { studentId } = req.params;
    try {
        const attempts = await ExamAttempt.getByStudentId(studentId);
        res.status(200).json({ attempts });
    } catch (err) {
        next(err);
    }
};

exports.createExamAttempt = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { studentId, assignmentId, attemptDate } = req.body;

    try {
        await ExamAttempt.create({ studentId, assignmentId, attemptDate });
        res.status(201).json({ message: 'Exam attempt recorded successfully!' });
    } catch (err) {
        next(err);
    }
};

exports.deleteExamAttempt = async (req, res, next) => {
    const { attemptId } = req.params;
    try {
        await ExamAttempt.delete(attemptId);
        res.status(200).json({ message: 'Exam attempt deleted successfully!' });
    } catch (err) {
        next(err);
    }
};
