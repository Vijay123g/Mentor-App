import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { Container, Paper, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import courseService from '../../services/courseService';
import questionService from '../../services/questionService';

const AddQuestion: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FieldValues>();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    const facultyId = localStorage.getItem('userId') || '';
    const fetchCourses = async () => {
      try {
        const response = await courseService.getFacultyCourseList(facultyId);
        setCourses(response.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const facultyId = localStorage.getItem('userId');
      const payload = {
        courseId: selectedCourse,
        facultyId,
        questionText: data.questionText,
      };
      await questionService.addQuestion(payload);
      alert('Question added successfully!');
      reset();
      setSelectedCourse(null); 
    } catch (error) {
      console.error("Error adding question:", error);
      alert('Failed to add question. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>Add New Question</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
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

          <TextField
            fullWidth
            label="Question Title"
            {...register('questionText', { required: 'Question title is required' })}
            error={!!errors.questionText}
            helperText={errors.questionText ? String(errors.questionText.message) : ''}
            sx={{ mb: 2 }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Question
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddQuestion;
