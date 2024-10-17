import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/./facultyDashboard.css';

const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate();

  const viewAssignedCourses = () => navigate('/faculty/view-assigned-courses');
  const addQuestions = () => navigate('/faculty/add-questions');
  const validateAnswers = () => navigate('/faculty/validate-answers');

  return (
    <div className="faculty-dashboard-container">
      <h2>Faculty Dashboard</h2>
      <button onClick={viewAssignedCourses}>View Assigned Courses</button>
      <button onClick={addQuestions}>Add Questions</button>
      <button onClick={validateAnswers}>Validate Answers</button>
    </div>
  );
};

export default FacultyDashboard;
