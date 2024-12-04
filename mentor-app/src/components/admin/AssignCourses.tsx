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
      try {
        const faculties = await courseService.getFacultyDetails();
        setFacultyList(faculties);
        console.log("Faculty List:", faculties); 
        const courses = await courseService.getCourses();
        setCoursesList(courses);
        console.log("Courses List:", courses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await courseService.assignCourse({ facultyId: data.facultyId, courseId: data.courseId });
      alert('Course assigned successfully!');
      setValue('courseId', '');
      setValue('facultyId', '');
    } catch (error) {
      alert('Failed to assign course. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>Assign Courses to Faculty</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Course</InputLabel>
            <Select 
              {...register('courseId', { required: 'Course is required' })} 
              error={!!errors.courseId}
              defaultValue="" 
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {coursesList.length > 0 ? (
  coursesList.map((course) => (
    <MenuItem key={course._id} value={course._id}>
      {course.courseName}
    </MenuItem>
  ))
) : (
  <MenuItem value="">No Courses Available</MenuItem>
)}

            </Select>
            {errors.courseId && (
              <Typography color="error">{String(errors.courseId.message)}</Typography>
            )}
          </FormControl>

          {}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Faculty</InputLabel>
            <Select 
              {...register('facultyId', { required: 'Faculty is required' })} 
              error={!!errors.facultyId}
              defaultValue="" 
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {facultyList.length > 0 ? (
                facultyList.map((faculty) => (
                  <MenuItem key={faculty._id} value={faculty._id}>{faculty.name}</MenuItem>
                ))
              ) : (
                <MenuItem value="">No Faculty Available</MenuItem>
              )}
            </Select>
            {errors.facultyId && (
              <Typography color="error">{String(errors.facultyId.message)}</Typography>
            )}
          </FormControl>

          {}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Assign Course
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AssignCourses;
