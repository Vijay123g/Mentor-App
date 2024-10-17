import React, { useState, useEffect } from 'react';
import answerService from '../../services/answerService';
import '../../styles/ValidateAnswers.css';

const ValidateAnswers: React.FC = () => {
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => {
    const facultyId = localStorage.getItem('userId') || '';
    if (facultyId) {
      answerService.getAnswersByFaculty(facultyId).then(response => {
        setAnswers(response.answers);
      }).catch(error => {
        console.error('Error fetching answers:', error);
      });
    }
  }, []);

  const onValidate = (element: any) => {
    answerService.validateAnswer(element.answer_id, element.validated_by, element.validation_status)
      .then(() => {
        alert('Answer validation status updated successfully!');
      })
      .catch(error => {
        console.error('Error updating validation status:', error);
        alert('Failed to update validation status.');
      });
  };

  return (
    <div className="validate-answers-container">
      <h2>Validate Student Answers</h2>
      {answers.length > 0 ? (
        <table className="answers-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Course</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Validation Status</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((answer, index) => (
              <tr key={index}>
                <td>{answer.student_name}</td>
                <td>{answer.title}</td>
                <td>{answer.question_text}</td>
                <td>{answer.answer_text}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={answer.validation_status}
                    onChange={() => onValidate({ ...answer, validation_status: !answer.validation_status })}
                  />
                  {answer.validation_status ? 'Validated' : 'Not Validated'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No answers available for validation.</p>
      )}
    </div>
  );
};

export default ValidateAnswers;
