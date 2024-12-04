import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import registrationService from '../../services/registrationService';
import assignmentService from '../../services/assignmentService';
import answerService from '../../services/answerService';

const AttemptExam: React.FC = () => {
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [assignmentsList, setAssignmentsList] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedFacultyCourse, setSelectedFacultyCourse] = useState<{ facultyId: string; courseId: string } | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<{ assignmentId: string; courseId: string } | null>(null);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [answerFiles, setAnswerFiles] = useState<{ [questionId: string]: File | null }>({});

  useEffect(() => {
    const studentId = localStorage.getItem('userId') || '';
    if (!studentId) {
      console.error('User ID not found in localStorage');
      return;
    }
    registrationService
      .getDetailedRegistrationsByStudent(studentId)
      .then((response) => {
        const courses = response.registrations.map((registration: any) => ({
          facultyCourseId: registration.facultyCourseId._id,
          courseId: registration.facultyCourseId.courseId._id,
          courseName: registration.facultyCourseId.courseId.courseName,
          facultyId: registration.facultyCourseId.facultyId._id,
          instructorName: registration.facultyCourseId.facultyId.name,
        }));
        setCoursesList(courses);
      })
      .catch((error) => console.error('Error fetching registered courses:', error));
  }, []);

  useEffect(() => {
    if (selectedFacultyCourse) {
      const { facultyId, courseId } = selectedFacultyCourse;
      assignmentService
        .getAssignmentsByFacultyAndCourse(facultyId, courseId)
        .then((response) => {
          setAssignmentsList(response.assignments || []);
        })
        .catch((error) => {
          console.error('Error fetching assignments:', error);
          setAssignmentsList([]);
        });
    } else {
      setAssignmentsList([]);
    }
  }, [selectedFacultyCourse]);

  useEffect(() => {
    if (selectedAssignment?.assignmentId) {
      assignmentService
        .getAssignmentsByAssignmentId(selectedAssignment.assignmentId)
        .then((response) => {
          const formattedQuestions = response.assignmentQuestions.map((item: any) => ({
            _id: item._id,
            questionText: item.questionId?.questionText || 'No question text available',
          }));
          setQuestions(formattedQuestions);
        })
        .catch((error) => console.error('Error fetching questions:', error));
    } else {
      setQuestions([]);
    }
  }, [selectedAssignment]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: value }));
  };

  const handleFileChange = (questionId: string, file: File | null) => {
    setAnswerFiles((prevFiles) => ({ ...prevFiles, [questionId]: file }));
  };

  const handleSubmitAnswer = async (questionId: string) => {
    const studentId = localStorage.getItem('userId');
    if (!studentId) {
      alert('User ID not found. Please log in again.');
      return;
    }

    if (!selectedAssignment) {
      alert('Please select a course and assignment.');
      return;
    }

    const { courseId, assignmentId } = selectedAssignment;

    const formData = new FormData();
    formData.append('questionId', questionId);
    formData.append('assignmentId', assignmentId);
    formData.append('courseId', courseId);
    formData.append('assignmentQuestionId', questionId); 
    formData.append('studentId', studentId);
    formData.append('answerText', answers[questionId] || '');
    if (answerFiles[questionId]) {
      formData.append('file', answerFiles[questionId] as Blob);
    }

    try {
      const response = await answerService.submitAnswer(formData);
      console.log('Answer submitted successfully:', response);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  return (
    <Box sx={{ padding: 3, marginTop: 8 }}>
      <Typography variant="h4" gutterBottom>
        Attempt Exam
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Select Course</InputLabel>
        <Select
          value={selectedFacultyCourse ? `${selectedFacultyCourse.facultyId}-${selectedFacultyCourse.courseId}` : ''}
          onChange={(e) => {
            const [facultyId, courseId] = e.target.value.split('-');
            setSelectedFacultyCourse({ facultyId, courseId });
          }}
        >
          {coursesList.map((course) => (
            <MenuItem key={`${course.facultyId}-${course.courseId}`} value={`${course.facultyId}-${course.courseId}`}>
              {`${course.courseName} (Instructor: ${course.instructorName})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedFacultyCourse && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Assignment</InputLabel>
          <Select
            value={selectedAssignment?.assignmentId || ''}
            onChange={(e) =>
              setSelectedAssignment({
                assignmentId: e.target.value,
                courseId: selectedFacultyCourse.courseId,
              })
            }
          >
            {assignmentsList.map((assignment) => (
              <MenuItem key={assignment._id} value={assignment._id}>
                {assignment.assignmentName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {questions.map((question) => (
        <Box key={question._id} sx={{ marginBottom: 2 }}>
          <Typography variant="body1">{question.questionText}</Typography>
          <TextField
            fullWidth
            label="Your Answer"
            multiline
            rows={4}
            value={answers[question._id] || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => handleFileChange(question._id, e.target.files?.[0] || null)}
          />
          {answerFiles[question._id] && (
            <Typography variant="body2" color="textSecondary">
              {answerFiles[question._id]?.name}
            </Typography>
          )}
          <Button variant="contained" onClick={() => handleSubmitAnswer(question._id)}>
            Submit Answer
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default AttemptExam;
