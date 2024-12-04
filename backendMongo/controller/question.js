const Question = require('../model/question')

exports.getAllQuestions = async (req, res, next) => {
    try {
        const questions = await Question.find().populate('courseId').populate('facultyId');
        res.status(200).json({ questions });
    } catch (error) {
        next(error);
    }
};

exports.getQuestionById = async (req, res, next) => {
    const { questionId } = req.params;

    try {
        const question = await Question.findById(questionId).populate('courseId').populate('facultyId');
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.status(200).json({ question });
    } catch (error) {
        next(error);
    }
};

exports.createQuestion = async (req, res, next) => {
    const { courseId, facultyId, questionText } = req.body;

    try {
        const question = new Question({ courseId, facultyId, questionText });
        await question.save();
        res.status(201).json({ message: 'Question created successfully!' });
    } catch (error) {
        next(error);
    }
};

exports.updateQuestion = async (req, res, next) => {
    const { questionId } = req.params;
    const { courseId, facultyId, questionText } = req.body;

    try {
        const question = await Question.findByIdAndUpdate(
            questionId,
            { courseId, facultyId, questionText },
            { new: true }
        );
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.status(200).json({ message: 'Question updated successfully!', question });
    } catch (error) {
        next(error);
    }
};

exports.deleteQuestion = async (req, res, next) => {
    const { questionId } = req.params;

    try {
        const result = await Question.findByIdAndDelete(questionId);
        if (!result) return res.status(404).json({ message: 'Question not found' });
        res.status(200).json({ message: 'Question deleted successfully!' });
    } catch (error) {
        next(error);
    }
};

exports.getQuestionsByFacultyAndCourse = async (req, res, next) => {
    const { facultyId, courseId } = req.params;

    try {
        const questions = await Question.find({ facultyId, courseId }).populate('courseId').populate('facultyId');
        res.status(200).json({ questions });
    } catch (error) {
        next(error);
    }
};
