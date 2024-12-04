import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import answerService from '../../services/answerService';

const ValidateAnswers: React.FC = () => {
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const facultyId = localStorage.getItem('userId') || '';

  useEffect(() => {
    setLoading(true);
    answerService
      .getAnswersByFaculty(facultyId)
      .then((response) => {
        console.log('API Response:', response);
        setAnswers(response);
      })
      .catch((error) => {
        console.error('Error fetching answers:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [facultyId]);

  const handleDownload = (fileId: string) => {
    if (fileId) {
      const downloadUrl = `http://localhost:3000/answer/file/${fileId}`;
      window.open(downloadUrl, '_blank');
    } else {
      alert('No file available for download');
    }
  };

  const handleValidateAnswer = async (answerId: string, score: number) => {
    try {
      const updatedAnswer = await answerService.validateAnswer(answerId, facultyId, 1, score);
      setAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer._id === updatedAnswer._id ? updatedAnswer : answer
        )
      );
      alert('Answer validated successfully.');
    } catch (error) {
      console.error('Error validating answer:', error);
      alert('Failed to validate the answer. Please try again.');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Validate Answers
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      ) : answers.length === 0 ? (
        <Typography>No answers available for validation.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Student</strong></TableCell>
                <TableCell><strong>Answer</strong></TableCell>
                <TableCell><strong>Validation Status</strong></TableCell>
                <TableCell><strong>Score</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {answers.map((answer) => (
                <TableRow key={answer._id}>
                  <TableCell>{answer.studentId?.name || 'Unknown'}</TableCell>
                  <TableCell>{answer.answerText || 'No answer provided'}</TableCell>
                  <TableCell>
                    {answer.validationStatus ? 'Validated' : 'Pending'}
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      defaultValue={answer.score || 0}
                      onChange={(e) => {
                        const newScore = Number(e.target.value);
                        setAnswers((prevAnswers) =>
                          prevAnswers.map((a) =>
                            a._id === answer._id ? { ...a, score: newScore } : a
                          )
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleValidateAnswer(answer._id, answer.score || 0)}
                      >
                        Validate
                      </Button>
                      {answer.fileId && answer.fileId._id && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={() => handleDownload(answer.fileId._id)}
                        >
                          Download File
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ValidateAnswers;
