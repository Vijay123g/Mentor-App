const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  description: { type: String, required: true },
  semester: { type: Number, required: true },
  slotsAvailable: { type: Number, required: true }, 
  location: { type: String, required: true },
  timings: { type: String, required: true }, 
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Course', courseSchema);
