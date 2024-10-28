import React, { useEffect, useState } from 'react';
import facultyService from '../../services/facultyService';
import { Card, CardContent, Typography, Grid } from '@mui/material';

interface FacultyDashboardSummaryProps {
  onCardClick: (component: string) => void;
}

const FacultyDashboardSummary: React.FC<FacultyDashboardSummaryProps> = ({ onCardClick }) => {
  const [courseCount, setCourseCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const facultyId = Number(localStorage.getItem('userId') || '');

  useEffect(() => {
    async function fetchData() {
      try {
        const detailedData = await facultyService.getDetailedFacultyCourseData(facultyId);
    
        const uniqueCourses = new Set(detailedData.map((item: any) => item.course_id));
        setCourseCount(uniqueCourses.size);

        const uniqueQuestions = new Set(detailedData.map((item: any) => item.question_id));
        setQuestionCount(uniqueQuestions.size);

        const uniqueStudents = new Set(detailedData.map((item: any) => item.student_id));
        setStudentCount(uniqueStudents.size);
      } catch (error) {
        console.error('Error fetching faculty dashboard data', error);
      }
    }

    fetchData();
  }, [facultyId]);

  return (
    <div style={{ paddingTop: '50px' }}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Card onClick={() => onCardClick('viewAssignedCourses')} style={{ cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h6">Courses</Typography>
              <Typography variant="h4">{courseCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card onClick={() => onCardClick('addQuestions')} style={{ cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h6">Questions Added</Typography>
              <Typography variant="h4">{questionCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card onClick={() => onCardClick('studentsByCourse')} style={{ cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h6">Students Registered</Typography>
              <Typography variant="h4">{studentCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default FacultyDashboardSummary;
