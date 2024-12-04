import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
} from '@mui/material';
import assignmentService from '../../services/assignmentService';

const ViewAssignmentsWithQuestions: React.FC = () => {
  const [assignmentsWithQuestions, setAssignmentsWithQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignmentsWithQuestions = async () => {
      setLoading(true);
      try {
        const facultyId = localStorage.getItem('userId') || ''; 
        const response = await assignmentService.getAssignmentsWithQuestionsByFaculty(facultyId);

      
        if (response && response.assignments) {
          setAssignmentsWithQuestions(response.assignments);
        } else {
          setAssignmentsWithQuestions([]);
        }
      } catch (err) {
        console.error('Error fetching assignments with questions:', err);
        setError('Failed to load assignments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentsWithQuestions();
  }, []);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          View Assignments and Questions
        </Typography>


        {loading ? (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          
          <Typography color="error">{error}</Typography>
        ) : assignmentsWithQuestions.length === 0 ? (
        
          <Typography>No assignments or questions found.</Typography>
        ) : (

          <List>
            {assignmentsWithQuestions.map((assignment) => (
              <React.Fragment key={assignment.assignmentId}>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {assignment.assignmentName} (ID: {assignment.assignmentId})
                </Typography>
                <List>
                  {assignment.questions.map((question: any) => (
                    <ListItem key={question._id}>
                      <ListItemText primary={question.questionText} />
                    </ListItem>
                  ))}
                </List>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default ViewAssignmentsWithQuestions;
