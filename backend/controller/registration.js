const Registration = require('../models/registration');
const { validationResult } = require('express-validator');

// Fetch all registrations
exports.getAllRegistrations = async (req, res, next) => {
    try {
        const [registrations] = await Registration.getAll();
        res.status(200).json({ registrations });
    } catch (error) {
        console.error('Error fetching registrations:', error.message);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

// Fetch registrations by student ID
exports.getRegistrationsByStudentId = async (req, res, next) => {
    const studentId = req.params.studentId;
    try {
        const [registrations] = await Registration.getByStudentId(studentId);
        res.status(200).json({ registrations });
    } catch (error) {
        console.error('Error fetching registrations for student:', error.message);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

// Create a new registration
exports.createRegistration = async (req, res, next) => {
    console.log('Request body:', req.body); // Debug log
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // Map courseId to facultyCourseId
    const { studentId, courseId, registrationDate } = req.body;
    const facultyCourseId = courseId;

    try {
        const result = await Registration.create({ studentId, facultyCourseId, registrationDate });
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating registration:', error.message);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};


// Delete a registration
exports.deleteRegistration = async (req, res, next) => {
    const registrationId = req.params.registrationId;
    try {
        const result = await Registration.delete(registrationId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting registration:', error.message);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};
