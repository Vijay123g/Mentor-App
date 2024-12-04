import React, { useState } from "react";
import { TextField, Button, List, ListItem, ListItemText, Checkbox } from "@mui/material";

const ToDoList: React.FC = () => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const handleCheckboxToggle = (index: number) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? `${task} ✅` : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div style={{ padding: "1rem", backgroundColor: "#f9f9f9", borderRadius: "10px" }}>
      <h3>To-Do List</h3>
      <TextField
        label="Add Task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={addTask}>
        Add Task
      </Button>
      <List>
        {tasks.map((task, index) => (
          <ListItem key={index}>
            <Checkbox onChange={() => handleCheckboxToggle(index)} />
            <ListItemText primary={task} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ToDoList;
