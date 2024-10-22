import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import courseService from "../../services/courseService";
import '../../styles/adminDashboard.css';

const AssignCourses: React.FC = () => {
  const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm<FieldValues>();
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);

  useEffect(() => {
    loadFacultyDetails();
    loadCourses();
  }, []);

  const loadFacultyDetails = async () => {
    try {
      const response = await courseService.getFacultyDetails();
      console.log('response',response);
      setFacultyList(response);
    } catch (error) {
      alert('Error fetching faculty details');
      console.error('Error fetching faculty details', error);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await courseService.getCourses();
      setCoursesList(response);
    } catch (error) {
      alert('Error fetching courses');
      console.error('Error fetching courses', error);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log('data',data);
    const payload = {
      facultyId: data.facultyId,
      courseId: data.courseId,
    };

    try {
      await courseService.assignCourse(payload);
      alert('Course assigned successfully!');
     
      setValue('courseId', '');
      setValue('facultyId', '');
    } catch (error) {
      alert('Failed to assign course. Please try again.');
      console.error('Error assigning course:', error);
    }
  };

  return (
    <div className="admin-assign-courses-container">
      <h2>Assign Courses to Faculty</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Select Course</label>
          <select {...register('courseId', { required: 'Course is required' })}>
            <option value="">Select a course</option>
            {coursesList.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          {errors.courseId && <p style={{ color: 'red' }}>{(errors.courseId as any).message}</p>}
        </div>

        <div>
          <label>Select Faculty</label>
          <select {...register('facultyId', { required: 'Faculty is required' })}>
            <option value="">Select a faculty</option>
            {facultyList.map(faculty => (
              <option key={faculty.user_id} value={faculty.user_id}>
                {faculty.name}
              </option>
            ))}
          </select>
          {errors.facultyId && <p style={{ color: 'red' }}>{(errors.facultyId as any).message}</p>}
        </div>

        <button type="submit">Assign Course</button>
      </form>
    </div>
  );
};

export default AssignCourses;
