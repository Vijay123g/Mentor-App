import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../../styles/adminDashboard.css';

const AdminDashboard: React.FC = () => {
  
const navigate = useNavigate();

  const addFaculty = () => navigate('/admin/add-faculty');
  const assignCourses = () => navigate('/admin/assign-courses');
  const viewFacultyDetails = () => navigate('/admin/view-faculty');
  const viewCourseDetails = () => navigate('/admin/view-courses');

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      <button onClick={addFaculty}>Add Faculty</button>
      <button onClick={assignCourses}>Assign Courses</button>
      <button onClick={viewFacultyDetails}>View Faculty Details</button>
      <button onClick={viewCourseDetails}>View Course Details</button>
    </div>
  );
};

export default AdminDashboard;
