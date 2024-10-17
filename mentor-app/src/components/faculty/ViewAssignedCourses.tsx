import React, { useEffect, useState } from 'react';
import courseService from '../../services/courseService';
import '../../styles/FacultyCourses.css';

const FacultyCourses: React.FC = () => {
  const [courseList, setCourseList] = useState<any[]>([]);

  useEffect(() => {
    const facultyId = localStorage.getItem('userId') || '';
    if (facultyId) {
      courseService.getFacultyCourseList(facultyId)
        .then(response => {
          setCourseList(response);
        })
        .catch(error => {
          console.error('Error fetching faculty details', error);
          alert('Error fetching faculty details');
        });
    }
  }, []);

  return (
    <div className="faculty-courses-container">
      <h2>You are assigned to the below courses</h2>
      <ul className="course-list">
        {courseList.length > 0 ? (
          courseList.map((course, index) => (
            <li key={index} className="course-item">
              {course.title}
            </li>
          ))
        ) : (
          <p>No courses assigned.</p>
        )}
      </ul>
    </div>
  );
};

export default FacultyCourses;
