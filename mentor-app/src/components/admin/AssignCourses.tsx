import React, { useEffect, useState } from 'react';
import courseService from "../../services/courseService";
import authService from "../../services/AuthService";
import '../../styles/adminDashboard.css';

const AssignCourses: React.FC = () => {
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);

  useEffect(() => {
    courseService.getFacultyDetails().then(response => setFacultyList(response));
    courseService.getCourses().then(response => setCoursesList(response));
  }, []);

  const assignCourse = (courseData: { facultyId: number, courseId: number }) => {
    courseService.assignCourse(courseData).then(() => {
      alert('Course assigned successfully!');
    });
  };

  return (
    <div className="admin-assign-courses-container">
      <h2>Assign Courses to Faculty</h2>
      <table>
        <thead>
          <tr>
            <th>Faculty</th>
            <th>Course</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {facultyList.map(faculty => (
            <tr key={faculty.id}>
              <td>{faculty.name}</td>
              <td>
                <select>
                  {coursesList.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </td>
              <td>
              <button
                  onClick={() => {
                    const selectedCourseId = Number(
                      (document.getElementById(`course-select-${faculty.id}`) as HTMLSelectElement).value
                    );
                    assignCourse({ facultyId: faculty.id, courseId: selectedCourseId });
                  }}
                >
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignCourses;
