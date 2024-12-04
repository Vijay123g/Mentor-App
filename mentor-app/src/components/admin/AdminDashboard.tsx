import React, { useState } from 'react';
import DefaultAdminComponent from './DefaultAdminComponent';
import AddFaculty from './AddFaculty';
import AssignCourses from './AssignCourses';
import CourseDetails from './ViewCourseDetails';
import ViewFacultyDetails from './ViewFacultyDetails';
import AppSidebar from '../shared/AppSidebar';
import CreateCourse from './CreateCourse';
import { Box, Container } from '@mui/material';

const AdminDashboard: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('default');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'addFaculty':
        return <AddFaculty />;
      case 'assignCourses':
        return <AssignCourses />;
      case 'viewFaculty':
        return <ViewFacultyDetails />;
      case 'addCourse':
        return <CreateCourse />;
      case 'viewCourses':
        return <CourseDetails />;
      default:
        return <DefaultAdminComponent />;
    }
  };

  return (
    <Box sx={{ display: 'flex', paddingTop: '64px' }}>
      <AppSidebar onSelectComponent={setSelectedComponent} role="admin" />
      <Container sx={{ flexGrow: 1, padding: '24px' }}>
        {renderComponent()}
      </Container>
    </Box>
  );
};

export default AdminDashboard;  
