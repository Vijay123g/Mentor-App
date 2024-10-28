import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import questionService from '../../services/questionService';
import answerService from '../../services/answerService';
import registrationService from '../../services/registrationService';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

interface Course {
  id: number;
  title: string;
}

interface Registration {
  course_id: number;
  title: string;
}

const AttemptExam: React.FC = () => {
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const selectedCourseId = watch('courseId');

  useEffect(() => {
    const studentId = localStorage.getItem('userId') || '';
    registrationService.getDetailedRegistrationsByStudent(studentId).then((response) => {
      const uniqueCourses = response.registrations.reduce((acc: Course[], registration: Registration) => {
        if (!acc.some((course: Course) => course.id === registration.course_id)) {
          acc.push({
            id: registration.course_id,
            title: registration.title,
          });
        }
        return acc;
      }, [] as Course[]);
      setCoursesList(uniqueCourses);
    });
  },[]);
  

  useEffect(() => {
    if (selectedCourseId) {
      questionService.getQuestionsByCourse(selectedCourseId)
        .then(response => setQuestions(response?.questions || []))  // Safeguard for undefined response
        .catch(error => console.error('Error fetching questions:', error));
      registrationService.getRegistrationsByCourse(selectedCourseId)
        .then(response => {
          const registration = response?.registrations?.find(
            (reg: { student_id: number }) => reg.student_id === parseInt(localStorage.getItem('userId') || '', 10)
          );
          if (registration) setRegistrationId(registration.registration_id);
        })
        .catch(error => console.error('Error fetching registrations by course:', error));
    }
  }, [selectedCourseId]);
  

  const onSubmit = async (data: any) => {
    if (!registrationId) {
      alert('Registration not found for this course.');
      return;
    }
    try {
      const facultyData = await answerService.getFacultyByCourse(data.courseId);
      await answerService.submitAnswer({
        registrationId,
        studentId: localStorage.getItem('userId') || '',
        questionId: data.questionId,
        answerText: data.answer,
        validatedBy: facultyData.facultyId,
        validationStatus: false,
      });
      alert('Answer submitted successfully!');
    } catch (error) {
      console.error('Error submitting answer', error);
      alert('Error submitting answer.');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">Attempt Exam</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Course</InputLabel>
          <Select {...register('courseId', { required: true })} defaultValue="">
            {coursesList.map(course => (
              <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {errors.courseId && <Typography color="error">Course is required</Typography>}

        <FormControl fullWidth margin="normal">
          <InputLabel>Select Question</InputLabel>
          <Select {...register('questionId', { required: true })} defaultValue="">
            {questions.map(question => (
              <MenuItem key={question.question_id} value={question.question_id}>{question.question_text}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {errors.questionId && <Typography color="error">Question is required</Typography>}

        <TextField
          label="Your Answer"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          {...register('answer', { required: true })}
          error={!!errors.answer}
          helperText={errors.answer && 'Answer is required'}
        />

        <Button variant="contained" color="primary" type="submit">
          Submit Answer
        </Button>
      </form>
    </Box>
  );
};

export default AttemptExam;
