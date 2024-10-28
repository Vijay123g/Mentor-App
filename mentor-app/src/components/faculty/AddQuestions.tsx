import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Tabs, Tab, Box, TextField, Button, Select, MenuItem, Typography } from '@mui/material';
import courseService from '../../services/courseService';
import questionService from '../../services/questionService';
import { SelectChangeEvent } from '@mui/material';

interface QuestionFormData {
  courseId: number;
  questionText: string;
}

const AddQuestions: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<QuestionFormData>();
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string>('');
  const [tabIndex, setTabIndex] = useState(0);
  const facultyId = localStorage.getItem('userId') || '';

  useEffect(() => {
    // Load courses on component mount
    courseService.getFacultyCourseList(facultyId).then(response => {
      setCoursesList(response);
    });
  }, [facultyId]);

  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const onSubmit: SubmitHandler<QuestionFormData> = (data) => {
    const questionData = { ...data, facultyId };
    questionService.addQuestion(questionData)
      .then(() => {
        alert('Question added successfully!');
        reset();
      })
      .catch((error) => {
        console.error('Error adding question:', error);
        alert('Failed to add question. Please try again.');
      });
  };

  const handleCourseSelect = (event: SelectChangeEvent<unknown>) => {
    const courseId = Number(event.target.value);
    const selectedCourse = coursesList.find(course => course.id === courseId);
    setSelectedCourseTitle(selectedCourse ? selectedCourse.title : 'Selected Course');
    loadQuestionsByCourse(courseId);
  };

  const loadQuestionsByCourse = (courseId: number) => {
    questionService.getQuestionsByFaculty(courseId, facultyId)
      .then((response: any) => {
        setQuestionsList(response.questions);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Add Question" />
        <Tab label="View Questions" />
      </Tabs>

      {tabIndex === 0 && (
        <Box p={3}>
          <Typography variant="h6">Add Questions</Typography>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Select 
              {...register('courseId', { required: 'Course is required' })}
              displayEmpty
              defaultValue=""
            >
              <MenuItem value="">
                <em>Select a course</em>
              </MenuItem>
              {coursesList.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.title}
                </MenuItem>
              ))}
            </Select>
            {errors.courseId && <Typography color="error">{errors.courseId.message}</Typography>}

            <TextField
              {...register('questionText', { required: 'Question text is required' })}
              label="Question"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
            />
            {errors.questionText && <Typography color="error">{errors.questionText.message}</Typography>}

            <Button type="submit" variant="contained" color="primary">Add Question</Button>
          </form>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box p={3}>
          <Typography variant="h6">Your Questions</Typography>
          <Select onChange={handleCourseSelect} displayEmpty defaultValue="">
            <MenuItem value="">
              <em>Select a course</em>
            </MenuItem>
            {coursesList.map(course => (
              <MenuItem key={course.id} value={course.id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>

          {questionsList.length === 0 ? (
            <Typography>No questions found for this course.</Typography>
          ) : (
            <ul>
              {questionsList.map((question, index) => (
                <li key={index}>{question.question_text}</li>
              ))}
            </ul>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AddQuestions;
