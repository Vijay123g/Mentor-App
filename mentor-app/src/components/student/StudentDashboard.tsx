import React, { useState } from 'react';
import AppSidebar from '../shared/AppSidebar';
import RegisterCourse from './RegisterCourse';
import ViewAssignments from './AttemptExam';
import AttemptExam from './AttemptExam';
import ViewResults from './ViewResults';

const StudentDashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState('Home');

  const renderComponent = () => {
    console.log('Rendering component:', selectedComponent);
    switch (selectedComponent) {
      case 'register-course':
        return <RegisterCourse />;
      case 'attempt-exam':
        return <AttemptExam/>;
      case 'view-results':
         return <ViewResults/>
      default:
        return <RegisterCourse />;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AppSidebar
        role="student"
        onSelectComponent={(component) => {
          console.log('Selected Component:', component);
          setSelectedComponent(component);
        }}
      />
      <div style={{ flex: 1, padding: '20px' }}>
        {renderComponent()}
      </div>
    </div>
  );
};

export default StudentDashboard;
