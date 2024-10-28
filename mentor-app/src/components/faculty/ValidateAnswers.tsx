import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Checkbox, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import answerService from '../../services/answerService';
import '../../styles/ValidateAnswers.css';

interface Answer {
  answer_id: number;
  student_name: string;
  title: string;
  question_text: string;
  answer_text: string;
  validation_status: number;
  course_id: string;
  validated_by: string;
}

interface CourseAnswers {
  [courseId: string]: {
    courseTitle: string;
    answers: Answer[];
  };
}

const ValidateAnswers: React.FC = () => {
  const [courseAnswers, setCourseAnswers] = useState<CourseAnswers>({});
  const facultyId = localStorage.getItem('userId') || '';

  useEffect(() => {
    if (facultyId) {
      answerService.getAnswersByFaculty(facultyId)
        .then(response => {
          const groupedByCourse = response.answers.reduce((acc: any, answer: Answer) => {
            const courseTitle = answer.title; 
            if (!acc[courseTitle]) {
              acc[courseTitle] = {
                courseTitle: courseTitle,
                answers: []
              };
            }
            acc[courseTitle].answers.push(answer);
            return acc;
          }, {});

          setCourseAnswers(groupedByCourse);
        })
        .catch(error => {
          console.error('Error fetching answers:', error);
        });
    }
  }, [facultyId]);

  const onValidate = (answer: Answer) => {
    const newValidationStatus = answer.validation_status === 1 ? 0 : 1; 

    answerService.validateAnswer(answer.answer_id, answer.validated_by, newValidationStatus)
      .then(() => {
        alert('Answer validation status updated successfully!');
        setCourseAnswers(prevState => {
          const updatedCourses = { ...prevState };
          const course = updatedCourses[answer.title]; 
          if (course) { 
            const answerIndex = course.answers.findIndex(a => a.answer_id === answer.answer_id);
            if (answerIndex !== -1) {
              course.answers[answerIndex].validation_status = newValidationStatus;
            }
          }

          return updatedCourses;
        });
      })
      .catch(error => {
        console.error('Error updating validation status:', error);
        alert('Failed to update validation status.');
      });
  };

  return (
    <Box className="validate-answers-container" sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h4" gutterBottom>Validate</Typography>
      {Object.keys(courseAnswers).length > 0 ? (
        Object.keys(courseAnswers).map(courseId => {
          const course = courseAnswers[courseId];
          if (!course || !course.answers) return null;

          return (
            <Accordion key={courseId}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{course.courseTitle}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <table className="answers-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Question</th>
                      <th>Answer</th>
                      <th>Validation Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.answers.map((answer, index) => (
                      <tr key={index}>
                        <td>{answer.student_name}</td>
                        <td>{answer.question_text}</td>
                        <td>{answer.answer_text}</td>
                        <td>
                          <Checkbox
                            checked={answer.validation_status === 1}
                            onChange={() => onValidate(answer)}
                          />
                          {answer.validation_status === 1 ? 'Validated' : 'Not Validated'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (
        <Typography variant="body1">No answers available for validation.</Typography>
      )}
    </Box>
  );
};

export default ValidateAnswers;
