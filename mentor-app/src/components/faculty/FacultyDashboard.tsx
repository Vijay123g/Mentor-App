import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/./facultyDashboard.css';
import FacultyCourses from './ViewAssignedCourses';
import AddQuestions from './AddQuestions';
import ValidateAnswers from './ValidateAnswers';
import ViewQuestions from './ViewQuestions';

const FacultyDashboard: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('default');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'viewAssignedCourses':
        return < FacultyCourses/>;
      case 'addQuestions':
        return <AddQuestions />;
      case 'validateAnswers':
        return <ValidateAnswers />;
      case 'viewCourses':
          return <ValidateAnswers />;
      case 'viewQuestions':
           return <ViewQuestions/>
      
      default:
        return <FacultyCourses />;
    }
  };

  return (
    <div className="faculty-dashboard-container">
      <div className="sidenav">
        <button onClick={() => setSelectedComponent('viewAssignedCourses')}>View Assigned Courses</button>
        <button onClick={() => setSelectedComponent('addQuestions')}>Add Questions</button>
        <button onClick={() => setSelectedComponent('validateAnswers')}>Validate Answers</button>
        <button onClick={() => setSelectedComponent('viewQuestions')}>View Questions</button>

      </div>
      <div className="main-content">
        {renderComponent()}
      </div>
    </div>
  );
};

export default FacultyDashboard;
