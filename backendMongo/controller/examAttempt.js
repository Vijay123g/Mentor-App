const examAttempt = require('../model/examAttempt')
const { validationResult } = require('express-validator');

exports.getAllExamAttempts = async (req, res, next) => {
    try {
        const attempts = await ExamAttempt.find().sort({ attemptDate: -1 });
        res.status(200).json({ attempts });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.getExamAttemptsByStudentId = async (req, res, next) => {
    const { studentId } = req.params;
    try {
        const attempts = await ExamAttempt.find({ studentId }).populate('assignmentId', 'assignmentName');
        res.status(200).json({ attempts });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
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
        const examAttempt = new ExamAttempt({ studentId, assignmentId, attemptDate });
        await examAttempt.save();
        res.status(201).json({ message: 'Exam attempt recorded successfully!', examAttempt });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Exam attempt already exists for this student and assignment.' });
        }
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.deleteExamAttempt = async (req, res, next) => {
    const { attemptId } = req.params;
    try {
        const result = await ExamAttempt.findByIdAndDelete(attemptId);
        if (!result) {
            return res.status(404).json({ message: 'Exam attempt not found' });
        }
        res.status(200).json({ message: 'Exam attempt deleted successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
