import React, { useState } from 'react';
import AppSidebar from '../shared/AppSidebar';
import AddQuestions from './AddQuestions';
import ViewQuestions from './ViewQuestions';
import ViewAssignedCourses from './ViewAssignedCourses';
import ValidateAnswers from './ValidateAnswers';
import { Box, Container } from '@mui/material';
import AddAssignment from './AddAssignment';
import LinkQuestionToAssignment from './LinkQuestionToAssignment';
import ViewAssignmentsWithQuestions from './ViewAssignments';

const FacultyDashboard: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('default');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'addQuestions':
        return <AddQuestions />;
      case 'viewQuestions':
        return <ViewQuestions />;
      case 'viewAssignedCourses':
        return <ViewAssignedCourses />;
      case 'validateAnswers':
        return <ValidateAnswers />;
      case 'addAssignment':
          return <AddAssignment />;
      case 'linkQuestionToAssignment':
        return <LinkQuestionToAssignment />;
        case 'viewAssignments':
          return <ViewAssignmentsWithQuestions />;
      default:
        return <ViewAssignedCourses />;
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
