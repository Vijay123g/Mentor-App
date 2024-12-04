const mongoose = require('mongoose');

const examAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  assignmentQuestionId:
   { type: mongoose.Schema.Types.ObjectId,
     ref: 'AssignmentQuestion' }, 
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  answerText: {
    type: String,
    required: true,
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    default: null,
  },
  validationStatus: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', 
    required: true,
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null,
  },
}, { timestamps: true });

const ExamAnswer = mongoose.model('ExamAnswer', examAnswerSchema);
module.exports = ExamAnswer;
