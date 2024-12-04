const Assignment = require('../models/assignment');
const { validationResult } = require('express-validator');

// Get all assignments
exports.getAllAssignments = async (req, res, next) => {
    try {
        const [assignments] = await Assignment.getAll();
        res.status(200).json({ assignments });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res, next) => {
    const assignmentId = req.params.assignmentId;
    try {
        const [assignment] = await Assignment.getById(assignmentId);
        res.status(200).json({ assignment });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Create a new assignment
exports.createAssignment = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { courseId, facultyId, assignmentName, expiryDate } = req.body;

    try {
        await Assignment.create({ courseId, facultyId, assignmentName, expiryDate });
        res.status(201).json({ message: 'Assignment created successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Update an assignment
exports.updateAssignment = async (req, res, next) => {
    const assignmentId = req.params.assignmentId;
    const { courseId, facultyId, assignmentName, expiryDate } = req.body;

    try {
        await Assignment.update(assignmentId, { courseId, facultyId, assignmentName, expiryDate });
        res.status(200).json({ message: 'Assignment updated successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Delete an assignment
exports.deleteAssignment = async (req, res, next) => {
    const assignmentId = req.params.assignmentId;
    try {
        await Assignment.delete(assignmentId);
        res.status(200).json({ message: 'Assignment deleted successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Get assignments by faculty and course
exports.getAssignmentsByFacultyAndCourse = async (req, res, next) => {
    const { facultyId, courseId } = req.params;
    try {
        const [assignments] = await Assignment.getAssignmentsByFacultyAndCourse(facultyId, courseId);
        res.status(200).json({ assignments });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Get assignments by faculty ID
exports.getAssignmentsByFacultyId = async (req, res, next) => {
    const facultyId = req.params.facultyId;
    try {
        const [assignments] = await Assignment.getAssignmentsByFacultyId(facultyId);
        res.status(200).json({ assignments });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Get assignments by course ID
exports.getAssignmentsByCourseId = async (req, res, next) => {
    const courseId = req.params.courseId;
    try {
        const [assignments] = await Assignment.getAssignmentsByCourseId(courseId);
        res.status(200).json({ assignments });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
