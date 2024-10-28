import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { Container, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import courseService from "../../services/courseService";

const AssignCourses: React.FC = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>();
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const faculties = await courseService.getFacultyDetails();
      setFacultyList(faculties);
      const courses = await courseService.getCourses();
      setCoursesList(courses);
    };
    fetchData();
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await courseService.assignCourse({ facultyId: data.facultyId, courseId: data.courseId });
      alert('Course assigned successfully!');
      setValue('courseId', '');
      setValue('facultyId', '');
    } catch {
      alert('Failed to assign course. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>Assign Courses to Faculty</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Course</InputLabel>
            <Select {...register('courseId', { required: 'Course is required' })} error={!!errors.courseId}>
              <MenuItem value=""><em>None</em></MenuItem>
              {coursesList.map((course) => (
                <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
              ))}
            </Select>
            {errors.courseId && <Typography color="error">{(errors.courseId as any).message}</Typography>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Faculty</InputLabel>
            <Select {...register('facultyId', { required: 'Faculty is required' })} error={!!errors.facultyId}>
              <MenuItem value=""><em>None</em></MenuItem>
              {facultyList.map((faculty) => (
                <MenuItem key={faculty.user_id} value={faculty.user_id}>{faculty.name}</MenuItem>
              ))}
            </Select>
            {errors.facultyId && <Typography color="error">{(errors.facultyId as any).message}</Typography>}
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Assign Course
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AssignCourses;
