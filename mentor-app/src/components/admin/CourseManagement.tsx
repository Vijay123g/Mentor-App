import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import AssignCourses from './AssignCourses';
import CourseDetails from './ViewCourseDetails';
import CreateCourse from './CreateCourse';
const CourseManagement: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Create Course" />
        <Tab label="View Courses by Semester" />
        <Tab label="Assign Courses" />
      </Tabs>

      {tabIndex === 0 && (
        <Box p={3}>
          <Typography variant="h6">Create Course</Typography>
          <CreateCourse />
        </Box>
      )}

      {tabIndex === 1 && (
        <Box p={3}>
          <Typography variant="h6">View Courses by Semester</Typography>
          <CourseDetails />
        </Box>
      )}

      {tabIndex === 2 && (
        <Box p={3}>
          <Typography variant="h6">Assign Courses</Typography>
          <AssignCourses />
        </Box>
      )}
    </Box>
  );
};

export default CourseManagement;
