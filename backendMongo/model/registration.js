const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facultyCourseId: { type: mongoose.Schema.Types.ObjectId, ref: 'FacultyCourse', required: true },
  registrationDate: { type: Date, required: true },
});

registrationSchema.statics.getByStudentId = async function (studentId) {
    return this.find({ studentId })
        .populate({
            path: 'facultyCourseId',
            populate: {
                path: 'courseId', 
                select: 'courseName'
            }
        })
        .populate({
            path: 'facultyCourseId',
            populate: {
                path: 'facultyId', 
                select: 'name'
            }
        })
        .populate('studentId', 'name email') 
        .exec();
};


registrationSchema.statics.createRegistration = async function ({ studentId, facultyCourseId, registrationDate }) {
  const existing = await this.findOne({ studentId, facultyCourseId });
  if (existing) {
    throw new Error('Course already registered by the student.');
  }

  const registration = new this({ studentId, facultyCourseId, registrationDate });
  await registration.save();

  await mongoose.model('FacultyCourse').updateOne(
    { _id: facultyCourseId },
    { $inc: { slotsAvailable: -1 } }
  );

  return { message: 'Registration successful.', registration };
};

module.exports = mongoose.model('Registration', registrationSchema);
