import React, { useState } from 'react';
import ViewAssignedCourses from './ViewAssignedCourses';
import AddQuestions from './AddQuestions';
import ValidateAnswers from './ValidateAnswers';
import AppSidebar from '../shared/AppSidebar';
import { Box, Container } from '@mui/material';
import FacultyDashboardSummary from './FacultyDashboardSummary';
import StudentsByCourse from './StudentsByCourse';

const FacultyDashboard: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('default');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'viewAssignedCourses':
        return <ViewAssignedCourses />;
      case 'addQuestions':
        return <AddQuestions />;
      case 'validateAnswers':
        return <ValidateAnswers />;
      case 'facultySummary':
          return <FacultyDashboardSummary onCardClick={setSelectedComponent} />;
      case 'studentsByCourse':
          return <StudentsByCourse />;
      default:
        return <FacultyDashboardSummary onCardClick={setSelectedComponent} />
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppSidebar onSelectComponent={setSelectedComponent} role="faculty" />
      <Container sx={{ flexGrow: 1, paddingTop: '50px' }}>
        {renderComponent()}
      </Container>
    </Box>
  );
};

export default FacultyDashboard;
