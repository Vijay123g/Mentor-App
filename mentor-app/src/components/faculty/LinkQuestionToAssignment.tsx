import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Button,
  Box,
} from '@mui/material';
import assignmentService from '../../services/assignmentService';
import questionService from '../../services/questionService';
import { SelectChangeEvent } from '@mui/material/Select';

const LinkQuestionToAssignment: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]); 
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>('');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(''); 
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(''); 
  const [loadingAssignments, setLoadingAssignments] = useState<boolean>(true); 
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false); 
  const [submitting, setSubmitting] = useState<boolean>(false);


  useEffect(() => {
    const fetchAssignments = async () => {
      const facultyId = localStorage.getItem('userId') || ''; 
      try {
        const response = await assignmentService.getAssignmentsByFaculty(facultyId);

  
        if (response && Array.isArray(response.assignments)) {
          setAssignments(response.assignments); 
        } else {
          console.error('Unexpected API response format:', response);
          setAssignments([]); 
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setAssignments([]);
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAssignments();
  }, []);

  
  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedAssignment && selectedCourseId) {
        setLoadingQuestions(true);
        try {
          const fetchedQuestions = await questionService.getQuestionsByFaculty(
            localStorage.getItem('userId') || '',
            selectedCourseId
          );
          setQuestions(fetchedQuestions); 
        } catch (error) {
          console.error('Error fetching questions:', error);
        } finally {
          setLoadingQuestions(false);
        }
      }
    };

    fetchQuestions();
  }, [selectedAssignment, selectedCourseId]);


  const handleAssignmentChange = (event: SelectChangeEvent<string>) => {
    const assignmentId = event.target.value;
    setSelectedAssignment(assignmentId);

    const selectedAssignment = assignments.find((assignment) => assignment._id === assignmentId);
    if (selectedAssignment) {
      setSelectedCourseId(selectedAssignment.courseId._id || null);
    }
  };

  const handleQuestionChange = (event: SelectChangeEvent<string>) => {
    setSelectedQuestion(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || !selectedQuestion) {
      alert('Please select both an assignment and a question.');
      return;
    }

    setSubmitting(true);
    try {
      await assignmentService.linkQuestionToAssignment(selectedAssignment, selectedQuestion);
      alert('Question successfully linked to the assignment!');
      setSelectedAssignment(null);
      setSelectedQuestion(null);
      setSelectedCourseId(null);
      setQuestions([]);
    } catch (error) {
      console.error('Error linking question to assignment:', error);
      alert('Failed to link question to the assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Link Question to Assignment
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Assignment</InputLabel>
          <Select
            value={selectedAssignment || ''}
            onChange={handleAssignmentChange}
            label="Assignment"
            disabled={loadingAssignments}
          >
            <MenuItem value="">Select an Assignment</MenuItem>
            {assignments.map((assignment) => (
              <MenuItem key={assignment._id} value={assignment._id}>
                {assignment.assignmentName} ({assignment.courseId.courseName})
              </MenuItem>
            ))}
          </Select>
          {loadingAssignments && (
            <CircularProgress size={24} sx={{ position: 'absolute', right: 10, top: '50%' }} />
          )}
        </FormControl>

        {selectedCourseId && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Question</InputLabel>
            <Select
              value={selectedQuestion || ''}
              onChange={handleQuestionChange}
              label="Question"
              disabled={loadingQuestions}
            >
              <MenuItem value="">Select a Question</MenuItem>
              {questions.map((question) => (
                <MenuItem key={question._id} value={question._id}>
                  {question.questionText}
                </MenuItem>
              ))}
            </Select>
            {loadingQuestions && (
              <CircularProgress size={24} sx={{ position: 'absolute', right: 10, top: '50%' }} />
            )}
          </FormControl>
        )}

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={submitting || !selectedAssignment || !selectedQuestion}
          >
            {submitting ? 'Submitting...' : 'Link Question to Assignment'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LinkQuestionToAssignment;
