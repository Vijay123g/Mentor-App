const Course = require('../models/admin');
const { validationResult } = require('express-validator');

exports.createCourse = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { title, description, facultyId } = req.body;

    try {
        const courseDetails = { title, description, facultyId };
        const result = await Course.save(courseDetails);

        if (result) {
            res.status(201).json({ message: 'Course created successfully' });
        } else {
            res.status(500).json({ message: 'Failed to create course' });
        }
    } catch (err) {
        next(err);
    }
};

exports.assignFaculty = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { courseId, facultyId } = req.body;

    try {
        const facultyName = await Course.assignFaculty(courseId, facultyId);

        if (facultyName) {
            res.status(200).json({ message: `Faculty ${facultyName} assigned to course successfully!` });
        } else {
            res.status(404).json({ message: 'Course or Faculty not found.' });
        }
    } catch (err) {
        next(err);
    }
};

exports.deleteCourse = async (req, res, next) => {
    const courseId = req.params.courseId;

    try {
        const result = await Course.delete(courseId);

        if (result) {
            res.status(200).json({ message: 'Course deleted successfully' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (err) {
        next(err);
    }
};
  
  exports.getCourses = async (req, res, next) => {
    try {
      const courses = await Course.getAllCourses();
      res.status(200).json(courses);
    } catch (err) {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    }
  };

  exports.getFacultyCourses = async (req, res, next) => {
    const facultyId = req.params.facultyId; 

    try {
        const courses = await Course.getFacultyCourses(facultyId); 

        if (courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for this faculty.' });
        }

        res.status(200).json(courses);
    } catch (err) {
        console.error('Error fetching faculty courses:', err);
        next(err);
    }


};

exports.getStudentCourses = async (req, res, next) => {
    const studentId = req.params.studentId; 

    try {
        console.log('studentID',studentId);
        const courses= await Course.getRegisteredCoursesByStudent(studentId); 

        if (!Array.isArray(courses) || courses.length === 0) {
            return res.status(404).json({ message: 'No registered courses found for this student.' });
        }

        res.status(200).json(courses); 
    } catch (err) {
        console.error('Error fetching registered courses:', err);
        next(err);
    }
};

exports.getAllAssignedCourses = async (req, res, next) => {
    try {
      const courses = await Course.getAssignedCourses();
  
      if (courses.length === 0) {
        return res.status(404).json({ message: 'No assigned courses found.' });
      }
  
      res.status(200).json(courses);
    } catch (err) {
      console.error('Error fetching assigned courses:', err);
      next(err);
    }
  };
  
  exports.getCounts = async (req, res, next) => {
    try {
        const [studentCountResult] = await Course.countStudent();
        const [facultyCountResult] = await Course.countFaculty();
        const [coursesCountResult] = await Course.countCourses();

        const studentCount = studentCountResult.studentCount || 0;
        const facultyCount = facultyCountResult.facultyCount || 0;
        const coursesCount = facultyCountResult.facultyCount || 0;

        res.status(200).json({
            studentCount,
            facultyCount,
            coursesCount,
        });
    } catch (error) {
        console.error('Error fetching counts:', error);
        res.status(500).json({ error: { message: error.message } });
    }
};

