const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignmentName: { type: String, required: true },
  expiryDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);
