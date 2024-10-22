import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import courseService from '../../services/courseService';
import questionService from '../../services/questionService';
import '../../styles/facultyDashboard.css';

interface QuestionFormData {
  courseId: number;
  questionText: string;
}

const AddQuestions: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<QuestionFormData>();
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const facultyId = localStorage.getItem('userId') || '';

  useEffect(() => {
    
    courseService.getFacultyCourseList(facultyId).then(response => {
      setCoursesList(response);
    });
  }, [facultyId]);

  const onSubmit: SubmitHandler<QuestionFormData> = (data) => {
    const questionData = { ...data, facultyId };
    
    questionService.addQuestion(questionData)
      .then(() => {
        alert('Question added successfully!');
        reset();
      })
      .catch((error) => {
        console.error('Error adding question:', error);
        alert('Failed to add question. Please try again.');
      });
  };

  return (
    <div className="faculty-add-questions-container">
      <h2>Add Questions</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label htmlFor="courseId">Course:</label>
          <select {...register('courseId', { required: 'Course is required' })}>
            <option value="">Select a course</option>
            {coursesList.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          {errors.courseId && (
            <p style={{ color: 'red' }}>
              {(errors.courseId as unknown as { message: string }).message}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="questionText">Question:</label>
          <textarea 
            {...register('questionText', { required: 'Question text is required' })} 
            placeholder="Enter your question" 
          />
          {errors.questionText && (
            <p style={{ color: 'red' }}>
              {(errors.questionText as unknown as { message: string }).message}
            </p>
          )}
        </div>

        <button type="submit">Add Question</button>
      </form>
    </div>
  );
};

export default AddQuestions;
