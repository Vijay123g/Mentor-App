const FacultyCourse = require('../model/facultyCourse');
const User = require('../model/admin'); 
const Course = require('../model/course');

exports.assignCourse = async (req, res, next) => {
    const { facultyId, courseId } = req.body;

    try {
        const assignment = new FacultyCourse({ facultyId, courseId });
        await assignment.save();
        res.status(201).json({ message: 'Course assigned to faculty successfully!' });
    } catch (error) {
        if (error.code === 11000) { 
            return res.status(400).json({ error: 'This course is already assigned to the faculty.' });
        }
        next(error);
    }
};

exports.getCoursesForFaculty = async (req, res, next) => {
    const { facultyId } = req.params;

    try {
        const courses = await FacultyCourse.find({ facultyId })
            .populate('courseId', 'courseName semester description') 
            .populate('facultyId', 'name email'); 
        res.status(200).json({ courses });
    } catch (error) {
        next(error);
    }
};


exports.getAllAssignedCourses = async (req, res, next) => {
    try {
        const courses = await FacultyCourse.find()
            .populate('courseId', 'courseName description semester slotsAvailable')
            .populate('facultyId', 'name email'); 
        res.status(200).json({ courses });
    } catch (error) {
        next(error);
    }
};

exports.getFacultyCourseAssignments = async (req, res, next) => {
    try {
        const assignments = await FacultyCourse.find()
            .populate('facultyId', 'name email')
            .populate('courseId', 'courseName semester description slotsAvailable');

        res.status(200).json({ assignments });
    } catch (error) {
        next(error);
    }
};
