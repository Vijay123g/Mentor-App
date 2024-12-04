const AssignmentQuestion = require('../models/assignmentQuestion');
const { validationResult } = require('express-validator');

// Get all assignment questions
exports.getAllAssignmentQuestions = async (req, res, next) => {
    try {
        const [assignmentQuestions] = await AssignmentQuestion.getAll();
        res.status(200).json({ assignmentQuestions });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Get assignment questions by assignment ID
exports.getAssignmentQuestionsByAssignmentId = async (req, res, next) => {
    const assignmentId = req.params.assignmentId;
    try {
        const [assignmentQuestions] = await AssignmentQuestion.getByAssignmentId(assignmentId);
        res.status(200).json({ assignmentQuestions });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Create a new assignment-question mapping
exports.createAssignmentQuestion = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { assignmentId, questionId } = req.body;

    try {
        await AssignmentQuestion.create({ assignmentId, questionId });
        res.status(201).json({ message: 'Assignment-question mapping created successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Delete an assignment-question mapping
exports.deleteAssignmentQuestion = async (req, res, next) => {
    const assignmentQuestionId = req.params.assignmentQuestionId;
    try {
        await AssignmentQuestion.delete(assignmentQuestionId);
        res.status(200).json({ message: 'Assignment-question mapping deleted successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Get assignments with questions for a specific faculty
exports.getAssignmentsWithQuestionsByFaculty = async (req, res, next) => {
    const { facultyId } = req.params;
    try {
        const [data] = await AssignmentQuestion.getAssignmentsWithQuestionsByFaculty(facultyId);

        const groupedData = data.reduce((result, item) => {
            const assignment = result.find((a) => a.assignment_id === item.assignment_id);
            if (assignment) {
                assignment.questions.push({ question_id: item.question_id, question_text: item.question_text });
            } else {
                result.push({
                    assignment_id: item.assignment_id,
                    assignment_name: item.assignment_name,
                    questions: [{ question_id: item.question_id, question_text: item.question_text }],
                });
            }
            return result;
        }, []);

        res.status(200).json({ assignmentQuestions: groupedData });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Get assignments for a specific faculty
exports.getFacultyAssignments = async (req, res, next) => {
    const { facultyId } = req.params;
    try {
        const [data] = await AssignmentQuestion.getFacultyAssignments(facultyId);
        res.status(200).json({ data });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// Get assignment questions by course ID
exports.getAssignmentQuestionsByCourseId = async (req, res, next) => {
    const courseId = req.params.courseId;

    try {
        const questions = await AssignmentQuestion.getQuestionsByCourseId(courseId);
        res.status(200).json({ questions });
    } catch (err) {
        console.error('Error:', err);
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
