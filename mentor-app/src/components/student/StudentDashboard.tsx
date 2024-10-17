import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/studentDashboard.css';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const studentName = localStorage.getItem('name') || '';

  const registerCourse = () => navigate('/student/register-course');
  const attemptExam = () => navigate('/student/attempt-exam');
  const viewResults = () => navigate('/student/view-results');

  return (
    <div className="dashboard-container">
      <div className="sidenav">
        <div className="button-container">
          <button className="button" onClick={registerCourse}>Register for Course</button>
          <button className="button" onClick={attemptExam}>Attempt Exam</button>
          <button className="button" onClick={viewResults}>View Results</button>
        </div>
      </div>
      <div className="content">
        <h2>Welcome, {studentName}!</h2>
      </div>
    </div>
  );
};

export default StudentDashboard;
