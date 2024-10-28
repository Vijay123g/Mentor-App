import React, { useEffect, useState } from 'react';
import authService from '../../services/AuthService';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const DefaultAdminComponent: React.FC = () => {
  const [facultyCount, setFacultyCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [courseCount, setCourseCount] = useState(20);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const counts = await authService.getCounts();
        setFacultyCount(counts.facultyCount);
        setStudentCount(counts.studentCount);
        setCourseCount(counts.coursesCount);
      } catch (error) {
        console.error('Error fetching counts', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <Grid container spacing={3} sx={{ marginTop: '20px' }}>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="textSecondary">
              Total Faculty
            </Typography>
            <Typography variant="h4" color="primary">
              {facultyCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="textSecondary">
              Total Students
            </Typography>
            <Typography variant="h4" color="primary">
              {studentCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="textSecondary">
              Total Courses
            </Typography>
            <Typography variant="h4" color="primary">
              {courseCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DefaultAdminComponent;
