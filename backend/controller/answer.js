const ExamAnswer = require('../models/answer');
const File = require('../models/Files');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });
// Your existing submitAnswer method after updating the field name
exports.submitAnswer = [
    upload.single('file'), // Expects 'file' field in form-data
    async (req, res, next) => {
      const { questionId, studentId, answerText, validatedBy, validationStatus, score } = req.body;
  
      try {
        let fileId = null;
        // Check if file exists and save it
        if (req.file) {
          const newFile = new File({
            file_name: req.file.originalname,
            file_type: req.file.mimetype,
            file_data: req.file.buffer,
            uploaded_by: studentId,
            question_id: questionId,
          });
          const savedFile = await newFile.save();
          fileId = savedFile._id;
        }
  
        // Create Exam Answer record
        await ExamAnswer.create({
          questionId,
          studentId,
          answerText,
          validatedBy,
          validationStatus,
          score,
          fileId,  // Will be null if no file is uploaded
        });
  
        res.status(201).json({ message: 'Answer submitted successfully!' });
      } catch (err) {
        next(err);
      }
    }
  ];
  
  

exports.getAnswersByStudent = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const [answers] = await ExamAnswer.getByStudentId(studentId);
    res.status(200).json({ answers });
  } catch (err) {
    next(err);
  }
};

exports.validateAnswer = async (req, res, next) => {
  const { answerId, validatedBy, validationStatus, score } = req.body;

  try {
    await ExamAnswer.validateAnswer(answerId, validatedBy, validationStatus, score);
    res.status(200).json({ message: 'Answer validated successfully!' });
  } catch (err) {
    next(err);
  }
};

exports.getAnswersByFaculty = async (req, res, next) => {
  const { facultyId } = req.params;

  try {
    const [answers] = await ExamAnswer.getByFacultyId(facultyId);
    res.status(200).json({ answers });
  } catch (err) {
    next(err);
  }
};

exports.downloadFile = async (req, res, next) => {
    const { fileId } = req.params;
  
    try {
      const file = await File.findById(fileId);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
  
      res.setHeader('Content-Disposition', `attachment; filename=${file.file_name}`);
      res.setHeader('Content-Type', file.file_type);
      res.send(file.file_data);  // Send the file data for download
    } catch (err) {
      next(err);
    }
  };
  
