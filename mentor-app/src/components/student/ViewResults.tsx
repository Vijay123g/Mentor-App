import React, { useEffect, useState } from 'react';
import answerService  from '../../services/answerService';
import '../../styles/viewResults.css';

const ViewResults: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    const studentId = localStorage.getItem('userId') || '';
    answerService.getAnswersByStudent(studentId).then(response => {
      setResults(response.answers);
      setResultMessage(response.allValidated
        ? 'You have passed all your exams/assignments!'
        : 'Waiting for results or validation.');
    });
  }, []);

  return (
    <div className="results-container">
      <h2>Exam/Assignment Results</h2>
      <p>{resultMessage}</p>
      {results.length > 0 ? (
        results.map(result => (
          <div key={result.id} className="result-card">
            <h3>Question: {result.question_text}</h3>
            <p><strong>Your Answer:</strong> {result.answer_text}</p>
            <p><strong>Validated By:</strong> {result.name}</p>
            <p><strong>Status:</strong> {result.validation_status ? 'Passed' : 'Awaiting'}</p>
          </div>
        ))
      ) : (
        <p>No results available.</p>
      )}
    </div>
  );
};

export default ViewResults;
