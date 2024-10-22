import React, { useEffect, useState } from 'react';
import authService from '../../services/AuthService';

const DefaultAdminComponent: React.FC = () => {
  const [facultyCount, setFacultyCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [courseCount, setCourseCount] = useState(20);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    const counts = await authService.getCounts();
    setFacultyCount(counts.facultyCount);
    setStudentCount(counts.studentCount);
    setCourseCount(counts.coursesCount);
  };

  return (
    <div className="dashboard-summary">
      <div className="stats">
        <div className="stat-card">
          <h3>Total Faculty</h3>
          <p>{facultyCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{studentCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p>{courseCount}</p>
        </div>
      </div>
    </div>
  );
};

export default DefaultAdminComponent;
