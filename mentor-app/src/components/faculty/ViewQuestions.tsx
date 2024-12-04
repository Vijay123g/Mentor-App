import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import courseService from '../../services/courseService';
import questionService from '../../services/questionService';

const ViewQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]); 
  const [courses, setCourses] = useState<any[]>([]); 
  const [selectedCourse, setSelectedCourse] = useState<number | string>(''); 

  useEffect(() => {
    const facultyId = localStorage.getItem('userId') || '';
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await courseService.getFacultyCourseList(facultyId);
        setCourses(fetchedCourses?.courses || []); 
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedCourse) return; 

      try {
        const facultyId = localStorage.getItem('userId') || '';
        const fetchedQuestions = await questionService.getQuestionsByFaculty(facultyId, selectedCourse);
        setQuestions(fetchedQuestions || []); 
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions([]); 
      }
    };
    fetchQuestions();
  }, [selectedCourse]);

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>View Questions</Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Course</InputLabel>
            <Select
              value={selectedCourse || ''}
              onChange={(e) => setSelectedCourse(e.target.value)}
              label="Course"
            >
              {courses.map(course => (
                <MenuItem key={course.courseId._id} value={course.courseId._id}>
                  {course.courseId.courseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        {questions.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question: any) => (
                <TableRow key={question._id}>
                  <TableCell>{question.questionText}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No questions available for the selected course.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ViewQuestions;
