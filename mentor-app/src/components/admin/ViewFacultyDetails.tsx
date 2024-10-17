import React, { useEffect, useState } from 'react';
import courseService from '../../services/courseService';
import '../../styles/adminDashboard.css';

const ViewFacultyDetails: React.FC = () => {
  const [facultyList, setFacultyList] = useState<any[]>([]);

  useEffect(() => {
    courseService.getFacultyDetails().then(response => setFacultyList(response));
  }, []);

  return (
    <div className="admin-view-faculty-container">
      <h2>Faculty Details</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Assigned Courses</th>
          </tr>
        </thead>
        <tbody>
          {facultyList.map(faculty => (
            <tr key={faculty.id}>
              <td>{faculty.name}</td>
              <td>{faculty.email}</td>
              <td>
                {faculty.courses.map((course: any) => (
                  <span key={course.id}>{course.title}, </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewFacultyDetails;
