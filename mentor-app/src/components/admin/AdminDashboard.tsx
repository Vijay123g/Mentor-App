import React, { useState } from 'react';
import '../../styles/adminDashboard.css';
import DefaultAdminComponent from './DefaultAdminComponent';
import AddFaculty from './AddFaculty';
import AssignCourses from './AssignCourses';
import CourseDetails from './ViewCourseDetails';
import ViewFacultyDetails from './ViewFacultyDetails';

const AdminDashboard: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('default');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'addFaculty':
        return <AddFaculty />;
      case 'assignCourses':
        return <AssignCourses />;
      case 'viewFaculty':
        return <ViewFacultyDetails />;
      case 'viewCourses':
          return <CourseDetails />;
      
      default:
        return <DefaultAdminComponent />;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="sidenav">
        <button onClick={() => setSelectedComponent('addFaculty')}>Add Faculty</button>
        <button onClick={() => setSelectedComponent('assignCourses')}>Assign Courses</button>
        <button onClick={() => setSelectedComponent('viewFaculty')}>View Faculty Details</button>
        <button onClick={() => setSelectedComponent('viewCourses')}>View Course Details</button>
      </div>
      <div className="main-content">
        {renderComponent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
