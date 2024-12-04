const Course = require('../models/course');
const { validationResult } = require('express-validator');

exports.getAllCourses = async (req, res, next) => {
    try {
        const [courses] = await Course.getAllCourses();
        res.status(200).json({ courses });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.getCourseById = async (req, res, next) => {
    const courseId = req.params.courseId;
    try {
        const [course] = await Course.getCourseById(courseId);
        res.status(200).json({ course });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.createCourse = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { courseName, description, semester,slots_avilable,location,Timings } = req.body;

    try {
        await Course.createCourse({ courseName, description, semester,slots_avilable,location,Timings });
        res.status(201).json({ message: 'Course created successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.updateCourse = async (req, res, next) => {
    const courseId = req.params.courseId;
    const { courseName, description, semester } = req.body;

    try {
        await Course.updateCourse(courseId, { courseName, description, semester });
        res.status(200).json({ message: 'Course updated successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.deleteCourse = async (req, res, next) => {
    const courseId = req.params.courseId;
    try {
        await Course.deleteCourse(courseId);
        res.status(200).json({ message: 'Course deleted successfully!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
