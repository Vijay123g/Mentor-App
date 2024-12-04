import React, { useEffect, useState } from 'react';
import courseService from '../../services/courseService';
import '../../styles/viewFaculty.css';
import defaultPhoto from '../../assets/images/back1.jpg';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface Faculty {
  id: string;
  _id:string;
  name: string;
  email: string;
  user_id?: string;
  photo?: string;
  mobile?: string;
  linkedin?: string;
}

interface Course {
  course_name: string;
  semester: number;
}

const ViewFacultyDetails: React.FC = () => {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCoursesDialog, setShowCoursesDialog] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [selectedFacultyName, setSelectedFacultyName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 5;
  const totalPages = Math.ceil(facultyList.length / pageSize);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const faculties = await courseService.getFacultyDetails();
        setFacultyList(Array.isArray(faculties) ? faculties : []);
        const courses = await courseService.getCourses();
        setCoursesList(Array.isArray(courses) ? courses : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleFacultyClick = async (facultyId: string, name: string) => {
    console.log("Faculty ID:", facultyId);
    setLoading(true);
    try {
        const response = await courseService.getFacultyCourseList(facultyId);
        const courses = response.courses.map((item: any) => ({
            course_name: item.courseId.courseName,
            semester: item.courseId.semester,
        }));
        setSelectedCourses(courses);
        setSelectedFacultyName(name);
        setShowCoursesDialog(true);
    } catch (error) {
        console.error("Error fetching assigned courses:", error);
        setError("Error fetching assigned courses.");
    } finally {
        setLoading(false);
    }
};


  const paginatedList = facultyList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const previousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="admin-view-faculty-container">
      <h2>Faculty Details</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{String(error)}</p>}

      <div className="faculty-grid">
        {paginatedList.map((faculty) => (
          <div
            className="faculty-card"
            key={faculty.id}
            onClick={() => handleFacultyClick(faculty._id || '', faculty.name)}
          >
            <img
              src={faculty.photo || defaultPhoto}
              alt={faculty.name}
              className="faculty-photo"
            />
            <div className="faculty-details">
              <h3>{faculty.name}</h3>
              <p>Email: {faculty.email}</p>
              <p>Employee ID: {faculty._id || 'Not Available'}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={previousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      <Dialog open={showCoursesDialog} onClose={() => setShowCoursesDialog(false)} maxWidth="sm" fullWidth>
    <DialogTitle>Assigned Courses for {selectedFacultyName}</DialogTitle>
    <DialogContent>
        <ul>
            {selectedCourses.length > 0 ? (
                selectedCourses.map((course, index) => (
                    <li key={index}>
                        {course.course_name} - Semester {course.semester}
                    </li>
                ))
            ) : (
                <p>No courses assigned.</p>
            )}
        </ul>
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setShowCoursesDialog(false)} color="primary">
            Close
        </Button>
    </DialogActions>
</Dialog>

    </div>
  );
};

export default ViewFacultyDetails;
