import React, { useEffect, useState } from 'react';
import courseService from '../../services/courseService';
import '../../styles/viewFaculty.css';
import defaultPhoto from '../../assets/images/back1.jpg';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface Faculty {
  id: string;
  name: string;
  email: string;
  user_id?: string;
  photo?: string;
  mobile?: string;
  linkedin?: string;
}

const ViewFacultyDetails: React.FC = () => {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCourses, setShowCourses] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedFacultyName, setSelectedFacultyName] = useState<string>('');

  const pageSize = 5;
  const totalPages = Math.ceil(facultyList.length / pageSize);

  useEffect(() => {
    courseService.getFacultyDetails().then(response => setFacultyList(response));
  }, []);

  const handleFacultyClick = (employeeId: string, facultyName: string) => {
    courseService.getFacultyCourseList(employeeId)
      .then(response => {
        setSelectedCourses(response.map((course: { title: string }) => course.title));
        setSelectedFacultyName(facultyName);
        setShowCourses(true);
      })
      .catch(error => console.error('Error fetching assigned courses:', error));
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
      <div className="faculty-grid">
        {paginatedList.map(faculty => (
          <div
            className="faculty-card"
            key={faculty.id}
            onClick={() => handleFacultyClick(faculty.user_id || '', faculty.name)}
          >
            <img
              src={faculty.photo || defaultPhoto}
              alt={faculty.name}
              className="faculty-photo"
            />
            <div className="faculty-details">
              <h3>{faculty.name}</h3>
              <p>Email: {faculty.email}</p>
              <p>Employee ID: {faculty.user_id || 'Not Available'}</p>
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

      <Dialog open={showCourses} onClose={() => setShowCourses(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assigned Courses for {selectedFacultyName}</DialogTitle>
        <DialogContent>
          <ul>
            {selectedCourses.length > 0 ? (
              selectedCourses.map((course, index) => (
                <li key={index}>{course}</li>
              ))
            ) : (
              <p>No courses assigned.</p>
            )}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCourses(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewFacultyDetails;
