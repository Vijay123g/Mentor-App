const Result = require('../models/results');
const { validationResult } = require('express-validator');

exports.getAllResults = async (req, res, next) => {
    try {
        const [results] = await Result.getAll();
        res.status(200).json({ results });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.getResultByAttemptId = async (req, res, next) => {
    const attemptId = req.params.attemptId;
    try {
        const [result] = await Result.getByAttemptId(attemptId);
        res.status(200).json({ result });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.createResult = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { attemptId, totalScore, passed } = req.body;

    try {
        await Result.create({ attemptId, totalScore, passed });
        res.status(201).json({ message: 'Result recorded successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.updateResult = async (req, res, next) => {
    const resultId = req.params.resultId;
    const updatedFields = req.body;

    try {
        await Result.update(resultId, updatedFields);
        res.status(200).json({ message: 'Result updated successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.deleteResult = async (req, res, next) => {
    const resultId = req.params.resultId;
    try {
        await Result.delete(resultId);
        res.status(200).json({ message: 'Result deleted successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
