import React, { useState, useEffect } from 'react';
import questionService from '../../services/questionService';
import courseService from '../../services/courseService';
import '../../styles/facultyDashboard.css';

const ViewQuestions: React.FC = () => {
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string | null>(null);
  const facultyId = localStorage.getItem('userId') || '';

  useEffect(() => {
    loadCourses();
  }, [facultyId]);

  const loadCourses = () => {
    courseService.getFacultyCourseList(facultyId).then((response: any) => {
      setCoursesList(response);
    }).catch((error: any) => {
      console.error('Error fetching courses:', error);
    });
  };

  const handleCourseSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = Number(event.target.value);
    const selectedCourse = coursesList.find(course => course.id === courseId);
    setSelectedCourseTitle(selectedCourse ? selectedCourse.title : 'Selected Course');
    loadQuestionsByCourse(courseId);
  };

  const loadQuestionsByCourse = (courseId: number) => {
    questionService.getQuestionsByFaculty(courseId, facultyId).then((response: any) => {
      setQuestionsList(response.questions);
    }).catch((error: any) => {
      console.error('Error fetching questions for the course:', error);
    });
  };

  return (
    <div className="faculty-view-questions-container">
      <h2>Your Questions</h2>

      <div className="form-field">
        <label htmlFor="course-select">Select Course</label>
        <select id="course-select" onChange={handleCourseSelect}>
          <option value="">Select a course</option>
          {coursesList.map(course => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {selectedCourseTitle && <h3>Questions for {selectedCourseTitle}</h3>}

      {questionsList.length === 0 ? (
        <div className="no-questions">
          <p>No questions found for this course.</p>
        </div>
      ) : (
        <ul className="questions-list">
          {questionsList.map((question, index) => (
            <li key={index} className="question-item">
              {question.question_text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewQuestions;
