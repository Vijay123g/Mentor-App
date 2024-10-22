import React, { useEffect, useState } from 'react';
import courseService from '../../services/courseService';
import '../../styles/viewFaculty.css';

const ViewFacultyDetails: React.FC = () => {
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(facultyList.length / pageSize);

  useEffect(() => {
    courseService.getFacultyDetails().then(response => setFacultyList(response));
  }, []);

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
        {paginatedList?.map(faculty => (
          <div className="faculty-card" key={faculty.id}>
            <img
              src={faculty.photo || '/assets/images/back1.jpg'}
              alt={faculty.name}
              className="faculty-photo"
            />
            <div className="faculty-details">
              <h3>{faculty.name}</h3>
              <p>Email: {faculty.email}</p>
              <p>Employee ID: {faculty.user_id || 'Not Available'}</p>
              <div className="faculty-icons">
                <a href={`mailto:${faculty.email}`} className="icon">
                  <i className="fas fa-envelope"></i>
                </a>
                {faculty.mobile && (
                  <a href={`tel:${faculty.mobile}`} className="icon">
                    <i className="fas fa-phone"></i>
                  </a>
                )}
                {faculty.linkedin && (
                  <a href={faculty.linkedin} target="_blank" rel="noopener noreferrer" className="icon">
                    <i className="fab fa-linkedin"></i>
                  </a>
                )}
              </div>
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
    </div>
  );
};

export default ViewFacultyDetails;
