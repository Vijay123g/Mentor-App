const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' },
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Question' },
    courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Assignment' },
    answerText: { type: String },
    answerFile: { type: Buffer }, // Binary data
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Answer', answerSchema);
