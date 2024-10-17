import React, { useEffect, useState } from 'react';
import courseService from '../../services/courseService';
import facultyService  from '../../services/facultyService';
import questionService from '../../services/questionService';
import '../../styles/facultyDashboard.css';

const AddQuestions: React.FC = () => {
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const facultyId = localStorage.getItem('userId') || '';

  useEffect(() => {
    facultyService.getCoursesByFacultyId(facultyId).then(response => setCoursesList(response));
  }, [facultyId]);

  const addQuestion = (courseId: number, questionText: string) => {
    const questionData = { courseId, facultyId, questionText };
    questionService.addQuestion(questionData).then(() => {
      alert('Question added successfully!');
    });
  };

  return (
    <div className="faculty-add-questions-container">
      <h2>Add Questions</h2>
      <select>
        {coursesList.map(course => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>
      <textarea placeholder="Enter your question" />
      <button onClick={() => addQuestion(Number((document.querySelector('select') as HTMLSelectElement).value), (document.querySelector('textarea') as HTMLTextAreaElement).value)}>
        Add Question
      </button>
    </div>
  );
};

export default AddQuestions;
