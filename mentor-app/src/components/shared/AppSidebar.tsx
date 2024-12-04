import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
} from "@mui/material";
import {
  Home,
  Book,
  Person,
  Inbox,
  ExpandLess,
  ExpandMore,
  Assignment,
  CheckCircle,
} from "@mui/icons-material";

interface SidebarProps {
  onSelectComponent: (component: string) => void;
  role: "admin" | "faculty" | "student";
}

const AppSidebar: React.FC<SidebarProps> = ({ onSelectComponent, role }) => {
  const [facultyOpen, setFacultyOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);

  const handleFacultyClick = () => setFacultyOpen(!facultyOpen);
  const handleCourseClick = () => setCourseOpen(!courseOpen);

  const adminItems = [
    { title: "Home", icon: <Home />, component: "default" },
    {
      title: "Faculty",
      icon: <Person />,
      children: [
        { title: "Add Faculty", component: "addFaculty" },
        { title: "View Faculty", component: "viewFaculty" },
      ],
    },
    {
      title: "Course",
      icon: <Book />,
      children: [
        { title: "Add Course", component: "addCourse" },
        { title: "View Courses", component: "viewCourses" },
        { title: "Assign Courses", component: "assignCourses" },
      ],
    },
  ];

  const facultyItems = [
    { title: "Home", icon: <Home />, component: "default" },
    {
      title: "Courses",
      icon: <Book />,
      children: [{ title: "View Assigned Courses", component: "viewAssignedCourses" }],
    },
    {
      title: "Questions",
      icon: <Inbox />,
      children: [
        { title: "Add Questions", component: "addQuestions" },
        { title: "View Questions", component: "viewQuestions" },
      ],
    },
    {
      title: "Answers",
      icon: <Person />,
      children: [{ title: "Validate Answers", component: "validateAnswers" }],
    },
    {
      title: "Assignments",
      icon: <Assignment />,
      children: [
        { title: "Add Assignment", component: "addAssignment" },
        { title: "Link Questions to Assignment", component: "linkQuestionToAssignment" },
        { title: "View Assignments", component: "viewAssignments" },
      ],
    },
  ];

  const studentItems = [
    { title: "Home", icon: <Home />, component: "home" },
    {
      title: "Register",
      icon: <Book />,
      component: "register-course",
    },

    {
      title: "Assignments",
      icon: <Assignment />,
      children: [
        { title: "attempt-exam", component: "attempt-exam" },
        { title: "View Results", component: "view-results" },
      ],
    },
  ];

  const items = role === "admin" ? adminItems : role === "faculty" ? facultyItems : studentItems;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 250,
        marginTop: "64px",
        "& .MuiDrawer-paper": { width: 250, boxSizing: "border-box", marginTop: "64px" },
      }}
    >
      <List>
        {items.map((item) => {
          if (item.children) {
            const open = item.title === "Faculty" ? facultyOpen : courseOpen;
            return (
              <React.Fragment key={item.title}>
                <ListItemButton
                  onClick={item.title === "Faculty" ? handleFacultyClick : handleCourseClick}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.title}
                        sx={{ pl: 4 }}
                        onClick={() => onSelectComponent(child.component)}
                      >
                        <ListItemText primary={child.title} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          } else {
            return (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  onClick={() => item.component && onSelectComponent(item.component)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            );
          }
        })}
      </List>
    </Drawer>
  );
};

export default AppSidebar;