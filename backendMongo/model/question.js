const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionText: { type: String, required: true },
}, { timestamps: true });

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
