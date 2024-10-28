import React, { useEffect, useState } from 'react';
import facultyService from '../../services/facultyService';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

interface Student {
  name: string;
  title : string;
}

interface CourseWithStudents {
  courseTitle: string;
  students: string[];
}

const StudentsByCourse: React.FC = () => {
  const [coursesWithStudents, setCoursesWithStudents] = useState<CourseWithStudents[]>([]);
  const facultyId = Number(localStorage.getItem('userId') || '');

  useEffect(() => {
    async function fetchCoursesWithStudents() {
      try {
        const detailedData: Student[] = await facultyService.getDetailedFacultyCourseData(facultyId);

        const groupedCourses = detailedData.reduce<Record<string, { courseTitle: string; students: Set<string> }>>((acc, item) => {
          const courseTitle = item.title; 
          if (!acc[courseTitle]) {
            acc[courseTitle] = { courseTitle: courseTitle, students: new Set() };
          }

          acc[courseTitle].students.add(item.name); 
          return acc;
        }, {});

        const formattedCourses: CourseWithStudents[] = Object.values(groupedCourses).map(course => ({
          courseTitle: course.courseTitle,
          students: Array.from(course.students),
        }));

        setCoursesWithStudents(formattedCourses);
      } catch (error) {
        console.error('Error fetching course student data', error);
      }
    }

    fetchCoursesWithStudents();
  }, [facultyId]);

  if (coursesWithStudents.length === 0) {
    return <Typography>No students registered for any courses.</Typography>;
  }

  return (
    <div>
      {coursesWithStudents.map(course => (
        <Card key={course.courseTitle} sx={{ marginBottom: '16px' }}>
          <CardContent>
            <Typography variant="h6">{course.courseTitle}</Typography>
            <List>
              {course.students.map((student, idx) => ( 
                <ListItem key={idx}>
                  <ListItemText primary={student} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StudentsByCourse;
