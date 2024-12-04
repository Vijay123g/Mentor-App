const mongoose = require('mongoose');


const assignmentQuestionSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
});

module.exports = mongoose.model('AssignmentQuestion', assignmentQuestionSchema);
