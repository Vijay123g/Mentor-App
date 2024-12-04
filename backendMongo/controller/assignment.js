const Assignment = require('../model/assignment');
const { validationResult } = require('express-validator');

exports.getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find()
      .populate('courseId', 'courseName')
      .populate('facultyId', 'name email');
    res.status(200).json({ assignments });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};


exports.getAssignmentById = async (req, res, next) => {
  const { assignmentId } = req.params;
  try {
    const assignment = await Assignment.findById(assignmentId)
      .populate('courseId', 'courseName')
      .populate('facultyId', 'name email');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json({ assignment });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.createAssignment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { courseId, facultyId, assignmentName, expiryDate } = req.body;

  try {
    const assignment = new Assignment({ courseId, facultyId, assignmentName, expiryDate });
    await assignment.save();
    res.status(201).json({ message: 'Assignment created successfully!', assignment });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updateAssignment = async (req, res, next) => {
  const { assignmentId } = req.params;
  const { courseId, facultyId, assignmentName, expiryDate } = req.body;

  try {
    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { courseId, facultyId, assignmentName, expiryDate },
      { new: true }
    );
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json({ message: 'Assignment updated successfully!', assignment });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteAssignment = async (req, res, next) => {
  const { assignmentId } = req.params;
  try {
    const assignment = await Assignment.findByIdAndDelete(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json({ message: 'Assignment deleted successfully!' });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getAssignmentsByFacultyAndCourse = async (req, res, next) => {
  const { facultyId, courseId } = req.params;
  try {
    const assignments = await Assignment.find({ facultyId, courseId })
      .populate('courseId', 'courseName')
      .populate('facultyId', 'name email');
    res.status(200).json({ assignments });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
