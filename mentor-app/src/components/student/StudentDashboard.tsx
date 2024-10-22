import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/studentDashboard.css';
import RegisterCourse from './RegisterCourse';
import AttemptExam from './AttemptExam';
import ViewResults from './ViewResults';

const StudentDashboard: React.FC = () => {

  const [selectedComponent, setSelectedComponent] = useState<string>('default');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'register-course':
        return < RegisterCourse/>;
      case 'attempt-exam':
        return <AttemptExam />;
      case 'view-results':
        return <ViewResults />;
      
      default:
        return <RegisterCourse />;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="sidenav">
        <button onClick={() => setSelectedComponent('register-course')}>Register</button>
        <button onClick={() => setSelectedComponent('attempt-exam')}>Exam</button>
        <button onClick={() => setSelectedComponent('view-results')}> Results</button>

      </div>
      <div className="main-content">
        {renderComponent()}
      </div>
    </div>
  );
};
export default StudentDashboard;
