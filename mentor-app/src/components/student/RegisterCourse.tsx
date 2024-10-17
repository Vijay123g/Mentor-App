import React, { useEffect, useState } from 'react';
import  courseService  from '../../services/courseService';
import  registrationService  from '../../services/registrationService';
import '../../styles/registerCourse.css';

const RegisterCourse: React.FC = () => {
  const [coursesList, setCoursesList] = useState<any[]>([]);

  useEffect(() => {
    courseService.getCourses().then(response => {
      setCoursesList(response);
    });
  }, []);

  const registerForCourse = (courseId: number) => {
    const studentId = localStorage.getItem('userId') || '';
    registrationService.registerCourse(studentId, courseId).then(() => {
      alert('Successfully registered!');
    });
  };

  return (
    <div className="course-container">
      <h2>Register for a Course</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Faculty Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {coursesList.map(course => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.description}</td>
              <td>{course.name}</td>
              <td>
                <button onClick={() => registerForCourse(course.id)}>Register</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisterCourse;
