const Course = require('../model/course');
const { validationResult } = require('express-validator');

exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find();
        res.status(200).json({ courses });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.getCourseById = async (req, res, next) => {
    const courseId = req.params.courseId;
    try {
        const course = await Course.findById(courseId).populate('faculty', 'name');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ course });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.createCourse = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { courseName, description, semester, slotsAvailable, location, timings } = req.body;

    try {
        const course = new Course({ courseName, description, semester, slotsAvailable, location, timings });
        await course.save();
        res.status(201).json({ message: 'Course created successfully!', course });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.updateCourse = async (req, res, next) => {
    const courseId = req.params.courseId;
    const { courseName, description, semester, slotsAvailable, location, timings } = req.body;

    try {
        const course = await Course.findByIdAndUpdate(
            courseId,
            { courseName, description, semester, slotsAvailable, location, timings },
            { new: true } 
        );
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course updated successfully!', course });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.deleteCourse = async (req, res, next) => {
    const courseId = req.params.courseId;
    try {
        const result = await Course.findByIdAndDelete(courseId);
        if (!result) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
