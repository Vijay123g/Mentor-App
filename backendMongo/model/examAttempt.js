const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const examAnswerSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
  answerText: String,
  validatedBy: { type: Schema.Types.ObjectId, ref: 'Faculty' },
  validationStatus: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  fileId: { type: Schema.Types.ObjectId, ref: 'File', default: null },
}, { timestamps: true });

const ExamAnswer = mongoose.model('ExamAnswer', examAnswerSchema);
module.exports = ExamAnswer;

const fileSchema = new Schema({
  file_name: String,
  file_type: String,
  file_data: Buffer,
  uploaded_by: { type: Schema.Types.ObjectId, ref: 'Student' },
  question_id: { type: Schema.Types.ObjectId, ref: 'Question' },
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);
module.exports = File;
