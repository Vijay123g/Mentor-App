import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import '../../styles/viewCourseDetails.css';
import  CourseService from '../../services/courseService';
import  FacultyService  from '../../services/facultyService';
import courseService from '../../services/courseService';

interface NewCourse {
  title: string;
  description: string;
  facultyId: string;
}

const CourseDetails: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<NewCourse>();
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

  const toggleAddCourse = () => setIsAddingCourse(!isAddingCourse);

  const fetchCourses = async () => {
    try {
      const response = await CourseService.getAssignedCourses();
      setCourseList(response);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await courseService.getFacultyDetails();
      setFacultyList(response);
    } catch (error) {
      console.error('Error fetching faculty details:', error);
    }
  };

  const createCourse: SubmitHandler<NewCourse> = async (newCourse) => {
    try {
      await CourseService.createCourse(newCourse);
      fetchCourses();
      reset();
      setIsAddingCourse(false);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchFaculties();
  }, []);

  return (
    <div className="course-details">
      <h2>Course Details</h2>
      <button onClick={toggleAddCourse}>Add New Course</button>

      {isAddingCourse && (
        <div className="add-course-form">
          <form onSubmit={handleSubmit(createCourse)}>
            <label>Title</label>
            <input {...register('title')} required />
            
            <label>Description</label>
            <input {...register('description')} required />
            
            <label>Faculty</label>
            <select {...register('facultyId')} required>
              {facultyList.map((faculty: any) => (
                <option key={faculty.user_id} value={faculty.user_id}>
                  {faculty.name}
                </option>
              ))}
            </select>
            
            <button type="submit">Create Course</button>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Assigned Faculty</th>
          </tr>
        </thead>
        <tbody>
          {courseList.map((course: any) => (
            <tr key={course.id}>
              <td>{course.course_title}</td>
              <td>{course.course_description}</td>
              <td>{course.faculty_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseDetails;
