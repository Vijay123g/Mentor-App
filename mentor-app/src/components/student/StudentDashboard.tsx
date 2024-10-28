import React, { useState } from 'react';
import RegisterCourse from './RegisterCourse';
import AttemptExam from './AttemptExam';
import ViewResults from './ViewResults';
import AppSidebar from '../shared/AppSidebar';
import HomeDashboard from './HomeDashboard';
import { Box, Container, Typography } from '@mui/material';

const StudentDashboard: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('default');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'home':
        return <HomeDashboard/>;
      case 'registerCourse':
        return <RegisterCourse />;
      case 'attemptExam':
        return <AttemptExam />;
      case 'viewResults':
        return <ViewResults />;
      default:
        return <HomeDashboard/>
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppSidebar onSelectComponent={setSelectedComponent} role="student" />
      <Container sx={{ flexGrow: 1, paddingTop: '50px' }}>
        {renderComponent()}
      </Container>
    </Box>
  );
};

export default StudentDashboard;
