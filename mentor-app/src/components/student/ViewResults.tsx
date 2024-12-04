import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import answerService from '../../services/answerService';

const ViewResults: React.FC = () => {
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => {
    const studentId = localStorage.getItem('userId') || '';
    if (!studentId) {
      console.error('User ID not found in localStorage');
      return;
    }

    answerService
      .getAnswersByStudent(studentId)
      .then((response) => {
        console.log('Response:', response);
        setAnswers(response.answers || []);
      })
      .catch((error) => console.error('Error fetching answers:', error));
  }, []);

  const handleDownload = (fileId: string) => {
    const downloadUrl = `http://localhost:3000/answer/file/${fileId}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <Box>
      <Typography variant="h4">View Results</Typography>
      {answers.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Answer</TableCell>
              <TableCell>Validation Status</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Assignment</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {answers.map((answer, index) => (
              <TableRow key={`${answer._id}-${index}`}>
                {/* Display questionText */}
                <TableCell>{answer.questionId?.questionText || 'N/A'}</TableCell>
                <TableCell>{answer.answerText || 'No answer provided'}</TableCell>
                <TableCell>{answer.validationStatus ? 'Validated' : 'Pending'}</TableCell>
                <TableCell>{answer.score || 0}</TableCell>
                <TableCell>{answer.courseId?.courseName || 'Course Not Available'}</TableCell>
                <TableCell>{answer.assignmentId?.assignmentName || 'Assignment Not Available'}</TableCell>
                <TableCell>
                  {answer.fileId && answer.fileId._id ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDownload(answer.fileId._id)}
                    >
                      Download
                    </Button>
                  ) : (
                    <Typography>No file available</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography>No results available.</Typography>
      )}
    </Box>
  );
};

export default ViewResults;
