const mongoose = require('mongoose');

const FacultyCourseSchema = new mongoose.Schema({
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
}, { timestamps: true });

FacultyCourseSchema.index({ facultyId: 1, courseId: 1 }, { unique: true });

const FacultyCourse = mongoose.model('FacultyCourse', FacultyCourseSchema);

module.exports = FacultyCourse;
