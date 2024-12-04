const ExamAnswer = require('../model/examAnswer');
const File = require('../model/File');
const multer = require('multer');
const Question = require('../model/question');
const Assignment = require('../model/assignment');
const AssignmentQuestion = require('../model/assignmentQuestion');
const FacultyCourses = require('../model/facultyCourse')

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.submitAnswer = [
  upload.single('file'),
  async (req, res, next) => {
    const { 
      questionId, 
      studentId, 
      answerText, 
      validatedBy, 
      validationStatus, 
      score, 
      courseId, 
      assignmentId
    } = req.body;

    try {
      let fileId = null;
      if (req.file) {
        const newFile = new File({
          fileName: req.file.originalname,
          fileType: req.file.mimetype,
          fileData: req.file.buffer,
          uploadedBy: studentId,
          questionId: questionId,
        });

        const savedFile = await newFile.save();
        fileId = savedFile._id;
      }


      const newAnswer = new ExamAnswer({
        questionId,
        studentId,
        answerText,
        validatedBy,
        validationStatus,
        score,
        courseId,
        assignmentId,
        fileId, 
      });

      await newAnswer.save();
      res.status(201).json({ message: 'Answer submitted successfully!' });
    } catch (err) {
      next(err); 
    }
  }
];

exports.downloadFile = async (req, res, next) => {
  const { fileId } = req.params;

  try {
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.setHeader('Content-Disposition', `attachment; filename=${file.fileName}`);
    res.setHeader('Content-Type', file.fileType);
    res.send(file.fileData); 
  } catch (err) {
    next(err); 
  }
};

exports.validateAnswer = async (req, res, next) => {
  const { answerId, validatedBy, validationStatus, score } = req.body;

  try {
    const updatedAnswer = await ExamAnswer.findByIdAndUpdate(
      answerId,
      { validatedBy, validationStatus, score },
      { new: true }
    );
    res.status(200).json(updatedAnswer);
  } catch (err) {
    next(err);
  }
};
exports.getAnswersByStudent = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const answers = await ExamAnswer.find({ studentId })
      .populate({
        path: 'questionId',
        select: 'questionText', 
      })
      .populate({
        path: 'assignmentId',
        select: 'assignmentName', 
      })
      .populate({
        path: 'courseId',
        select: 'courseName',
      })
      .populate({
        path: 'fileId',
        select: 'file_name', 
      });

    if (!answers.length) {
      return res.status(404).json({ message: 'No answers found for the student.' });
    }

    res.status(200).json({ answers });
  } catch (err) {
    console.error(err);
    next(err);
  }
};


exports.validateAnswer = async (req, res, next) => {
  const { answerId, validatedBy, validationStatus, score } = req.body;

  try {
    const updatedAnswer = await ExamAnswer.findByIdAndUpdate(
      answerId,
      { validatedBy, validationStatus, score },
      { new: true }
    )
    .populate('questionId', 'questionText')
    .populate('courseId', 'courseName')    
    .populate('fileId')                     
    .populate('assignmentId');              

    if (!updatedAnswer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    res.status(200).json(updatedAnswer);
  } catch (err) {
    next(err);
  }
};

exports.getAnswersByFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const facultyCourses = await FacultyCourses.find({ facultyId }).populate('courseId');
    const courseIds = facultyCourses.map(fc => fc.courseId._id);

    if (courseIds.length === 0) {
      return res.status(404).json({ message: 'No courses found for the given faculty.' });
    }

    const questions = await Question.find({ facultyId, courseId: { $in: courseIds } });
    const questionIds = questions.map(q => q._id);

    if (questionIds.length === 0) {
      return res.status(404).json({ message: 'No questions found for the given faculty.' });
    }

    const assignmentQuestions = await AssignmentQuestion.find({ questionId: { $in: questionIds } });
    const assignmentQuestionIds = assignmentQuestions.map(aq => aq._id);

    if (assignmentQuestionIds.length === 0) {
      return res.status(404).json({ message: 'No assignment questions found for the given faculty.' });
    }

    const answers = await ExamAnswer.find({ assignmentQuestionId: { $in: assignmentQuestionIds } })
      .populate({
        path: 'assignmentQuestionId',
        populate: {
          path: 'questionId',
          model: 'Question',
          select: 'questionText courseId',
          populate: {
            path: 'courseId',
            model: 'Course',
            select: 'courseName'
          }
        }
      })
      .populate({
        path: 'studentId',
        select: 'name'
      })
      .populate({
        path: 'fileId',
        select: 'fileName fileType fileData', 
      })
      .populate('assignmentId');

    if (answers.length === 0) {
      return res.status(404).json({ message: 'No answers found for the given faculty.' });
    }

    const enhancedAnswers = answers.map(answer => {
      if (answer.fileId) {
        const file = answer.fileId;

        file.downloadUrl = `${req.protocol}://${req.get('host')}/files/download/${file._id}`;
      }
      return answer;
    });

    res.status(200).json(enhancedAnswers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};





