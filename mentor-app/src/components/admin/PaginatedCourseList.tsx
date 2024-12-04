import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Typography } from '@mui/material';

interface Course {
  faculty_course_id: number;
  faculty_id: number;
  course_name: string;
  description: string;
  semester: number;
  slots_avilable: number;
  name: string;
}

interface PaginatedCourseListProps {
  courses: Course[];
}

const PaginatedCourseList: React.FC<PaginatedCourseListProps> = ({ courses }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const paginatedCourses = courses.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Assigned Courses
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Faculty Name</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Slots Available</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCourses.map((course) => (
              <TableRow key={course.faculty_course_id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.course_name}</TableCell>
                <TableCell>{course.semester}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>{course.slots_avilable}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(courses.length / recordsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />
    </Paper>
  );
};

export default PaginatedCourseList;
