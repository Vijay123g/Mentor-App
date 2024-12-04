const Validation = require('../models/validation');
const { validationResult } = require('express-validator');

exports.getAllValidations = async (req, res, next) => {
    try {
        const [validations] = await Validation.getAll();
        res.status(200).json({ validations });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.getValidationByAnswerId = async (req, res, next) => {
    const answerId = req.params.answerId;
    try {
        const [validation] = await Validation.getByAnswerId(answerId);
        res.status(200).json({ validation });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.createValidation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { answerId, facultyId, validationDate, comments } = req.body;

    try {
        await Validation.create({ answerId, facultyId, validationDate, comments });
        res.status(201).json({ message: 'Validation recorded successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.updateValidation = async (req, res, next) => {
    const validationId = req.params.validationId;
    const updatedFields = req.body;

    try {
        await Validation.update(validationId, updatedFields);
        res.status(200).json({ message: 'Validation updated successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.deleteValidation = async (req, res, next) => {
    const validationId = req.params.validationId;
    try {
        await Validation.delete(validationId);
        res.status(200).json({ message: 'Validation deleted successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.getValidationsWithAnswers = async (req, res) => {
    try {
        const [validations] = await Validation.getValidationsWithAnswers();
        res.json({ validations });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving validations with answers' });
    }
};