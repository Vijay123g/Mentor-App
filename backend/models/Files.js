const mongoose = require('mongoose');

// Schema for storing files in MongoDB
const fileSchema = new mongoose.Schema({
  file_name: { type: String, required: true },
  file_type: { type: String, required: true },
  file_data: { type: Buffer, required: true },
  uploaded_by: { type: Number, required: true },
  question_id: { type: Number, required: true }
});

module.exports = mongoose.model('File', fileSchema);
