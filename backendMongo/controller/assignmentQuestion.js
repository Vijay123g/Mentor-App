const AssignmentQuestion = require('../model/assignmentQuestion');
const Assignment = require('../model/assignment');
const Question = require('../model/question');

exports.getAllAssignmentQuestions = async (req, res, next) => {
    try {
        const assignmentQuestions = await AssignmentQuestion.find()
            .populate('assignmentId', 'assignmentName courseId')
            .populate('questionId', 'questionText');
        res.status(200).json({ assignmentQuestions });
    } catch (err) {
        next(err);
    }
};

exports.getAssignmentQuestionsByAssignmentId = async (req, res, next) => {
    const { assignmentId } = req.params;
    try {
        const assignmentQuestions = await AssignmentQuestion.find({ assignmentId })
            .populate('questionId', 'questionText');
        res.status(200).json({ assignmentQuestions });
    } catch (err) {
        next(err);
    }
};

exports.createAssignmentQuestion = async (req, res, next) => {
    const { assignmentId, questionId } = req.body;

    try {
        const newMapping = new AssignmentQuestion({ assignmentId, questionId });
        await newMapping.save();
        res.status(201).json({ message: 'Assignment-question mapping created successfully!' });
    } catch (err) {
        next(err);
    }
};

exports.deleteAssignmentQuestion = async (req, res, next) => {
    const { assignmentQuestionId } = req.params;

    try {
        await AssignmentQuestion.findByIdAndDelete(assignmentQuestionId);
        res.status(200).json({ message: 'Assignment-question mapping deleted successfully!' });
    } catch (err) {
        next(err);
    }
};


exports.getAssignmentsWithQuestionsByFaculty = async (req, res, next) => {
    const { facultyId } = req.params;

    try {
        const assignments = await Assignment.find({ facultyId })
            .populate({
                path: '_id',
                populate: {
                    path: 'courseId',
                    select: 'courseName',
                },
            });
        const groupedAssignments = await Promise.all(assignments.map(async (assignment) => {
            const questions = await AssignmentQuestion.find({ assignmentId: assignment._id })
                .populate('questionId', 'questionText');
            return {
                assignmentId: assignment._id,
                assignmentName: assignment.assignmentName,
                courseName: assignment.courseId.courseName,
                questions: questions.map(q => q.questionId),
            };
        }));

        res.status(200).json({ assignments: groupedAssignments });
    } catch (err) {
        next(err);
    }
};

exports.getFacultyAssignments = async (req, res, next) => {
    const { facultyId } = req.params;

    try {
        const assignments = await Assignment.find({ facultyId })
            .populate('courseId', 'courseName');
        res.status(200).json({ assignments });
    } catch (err) {
        next(err);
    }
};


exports.getAssignmentQuestionsByCourseId = async (req, res, next) => {
    const { courseId } = req.params;

    try {
     
        const assignments = await Assignment.find({ courseId }).select('_id assignmentName');

        if (!assignments.length) {
            return res.status(404).json({ message: 'No assignments found for this course.' });
        }

        const assignmentIds = assignments.map((a) => a._id);


        const assignmentQuestions = await AssignmentQuestion.find({ assignmentId: { $in: assignmentIds } })
            .populate('questionId', 'questionText')
            .populate('assignmentId', 'assignmentName');

        if (!assignmentQuestions.length) {
            return res.status(404).json({ message: 'No questions found for the assignments in this course.' });
        }

        const questions = assignmentQuestions.map((aq) => ({
            questionText: aq.questionId.questionText,
            assignmentName: aq.assignmentId.assignmentName,
        }));

        res.status(200).json({ questions });
    } catch (err) {
        console.error('Error fetching assignment questions by course ID:', err);
        next(err);
    }
};

