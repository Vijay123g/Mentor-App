import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import  courseService  from '../../services/courseService';
import  questionService  from '../../services/questionService';
import  answerService  from '../../services/answerService';
import '../../styles/attemptExam.css';

const AttemptExam: React.FC = () => {
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const { register, handleSubmit, watch } = useForm();
  const selectedCourseId = watch('courseId');

  useEffect(() => {
    courseService.getRegisteredCourses(localStorage.getItem('userId') || '').then(response => {
      setCoursesList(response);
    });
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      questionService.getQuestionsByCourse(selectedCourseId).then(response => {
        setQuestions(response.questions);
      });
    }
  }, [selectedCourseId]);

  const onSubmit = (data: any) => {
    const studentId = localStorage.getItem('userId') || '';
    answerService.submitAnswer({
      studentId,
      courseId: data.courseId,
      questionId: data.questionId,
      answerText: data.answer,
    }).then(() => {
      alert('Answer submitted successfully!');
    });
  };

  return (
    <div className="attempt-exam-container">
      <h2>Attempt Exam</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label>Select Course</label>
          <select {...register('courseId', { required: true })}>
            {coursesList.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Select Question</label>
          <select {...register('questionId', { required: true })}>
            {questions.map(question => (
              <option key={question.question_id} value={question.question_id}>
                {question.question_text}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Your Answer</label>
          <textarea {...register('answer', { required: true })}></textarea>
        </div>
        <button type="submit">Submit Answer</button>
      </form>
    </div>
  );
};

export default AttemptExam;
