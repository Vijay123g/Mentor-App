import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import courseService from '../../services/courseService';
import questionService from '../../services/questionService';
import answerService from '../../services/answerService';
import registrationService from '../../services/registrationService';
import '../../styles/attemptExam.css';

const AttemptExam: React.FC = () => {
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const selectedCourseId = watch('courseId');

  useEffect(() => {
    const studentId = localStorage.getItem('userId') || '';
    courseService.getRegisteredCourses(studentId).then(response => {
      setCoursesList(response);
    }).catch(error => {
      console.error('Error fetching registered courses', error);
    });
  }, []);

  useEffect(() => {
    if (selectedCourseId) {

      questionService.getQuestionsByCourse(selectedCourseId).then(response => {
        setQuestions(response.questions);
      }).catch(error => {
        console.error('Error fetching questions', error);
      });

      registrationService.getRegistrationsByCourse(selectedCourseId).then(response => {
        const registration = response.registrations.find((reg: { student_id: number }) => reg.student_id === parseInt(localStorage.getItem('userId') || '', 10));
        if (registration) {
          setRegistrationId(registration.registration_id);
        } else {
          console.error('No registration found for this course.');
        }
      }).catch(error => {
        console.error('Error fetching registrations for course', error);
      });
    }
  }, [selectedCourseId]);

  const onSubmit = async (data: any) => {
    const studentId = localStorage.getItem('userId') || '';
    
    try {
      const facultyData = await answerService.getFacultyByCourse(data.courseId);
      const facultyId = facultyData.facultyId;
      
      await answerService.submitAnswer({
        registrationId,
        studentId,
        questionId: data.questionId,
        answerText: data.answer,
        validatedBy: facultyId,
        validationStatus: false,
      });

      alert('Answer submitted successfully!');
    } catch (error) {
      console.error('Error submitting answer', error);
      alert('Error submitting answer.');
    }
  };

  return (
    <div className="attempt-exam-container">
      <h2>Attempt Exam</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label>Select Course</label>
          <select {...register('courseId', { required: true })}>
            <option value="">Select a course</option>
            {coursesList.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          {errors.courseId && <span className="error">Course is required</span>}
        </div>

        <div className="form-field">
          <label>Select Question</label>
          <select {...register('questionId', { required: true })}>
            <option value="">Select a question</option>
            {questions.map(question => (
              <option key={question.question_id} value={question.question_id}>
                {question.question_text}
              </option>
            ))}
          </select>
          {errors.questionId && <span className="error">Question is required</span>}
        </div>

        <div className="form-field">
          <label>Your Answer</label>
          <textarea {...register('answer', { required: true })}></textarea>
          {errors.answer && <span className="error">Answer is required</span>}
        </div>

        <button type="submit">Submit Answer</button>
      </form>
    </div>
  );
};

export default AttemptExam;
