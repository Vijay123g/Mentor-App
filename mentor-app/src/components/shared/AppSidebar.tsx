import React, { Profiler } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Inbox, CalendarToday, Search, Settings, QuestionAnswer, GolfCourse, QueryBuilder, Person, Book } from '@mui/icons-material';

const adminItems = [
  { title: 'Home', icon: <Home />, component: 'default' },
  { title: 'Add Faculty', icon: <Inbox />, component: 'addFaculty' },
  { title: 'Assign Courses', icon: <CalendarToday />, component: 'assignCourses' },
  { title: 'View Faculty', icon: <Settings />, component: 'viewFaculty' },
  { title: 'View Courses', icon: <Search />, component: 'viewCourses' },
];

const facultyItems = [
  { title: 'Home',icon: <Home />, component: 'facultySummary' },
  { title: 'Courses', icon: <Book/>, component: 'viewAssignedCourses' },
  { title: 'Question', icon: <QuestionAnswer />, component: 'addQuestions' },
  { title: 'Validate', icon: <QueryBuilder />, component: 'validateAnswers' },
  { title: 'Students',icon: <Person/>, component: 'studentsByCourse' },
];

const studentItems = [
  { title: 'Home', icon: <Home />, component: 'home' },
  { title: 'Courses', icon: <Search />, component: 'registerCourse' },
  { title: 'Results', icon: < QuestionAnswer/>, component: 'viewResults' },
  { title: 'Exam', icon: <CalendarToday />, component: 'attemptExam' },
];

interface SidebarProps {
  onSelectComponent: (component: string) => void;
  role: 'admin' | 'faculty' | 'student';
}

const AppSidebar: React.FC<SidebarProps> = ({ onSelectComponent, role }) => {
  let items = [];

  switch (role) {
    case 'admin':
      items = adminItems;
      break;
    case 'faculty':
      items = facultyItems;
      break;
    case 'student':
      items = studentItems;
      break;
    default:
      items = adminItems
      break;
  }

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 250,
        marginTop: '64px', 
        '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box', marginTop: '64px' },
      }}
    >
      <List>
        {items.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton onClick={() => onSelectComponent(item.component)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default AppSidebar;
