const express = require('express');  
const bodyParser = require('body-parser');
const mongoose = require('./connection/db');  
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const questionRoutes = require('./routes/question');
const assignmentRoutes = require('./routes/assignment');
const answerRoutes = require('./routes/answer');
const courseRoute = require('./routes/course');
const facultyCourse = require('./routes/facultyCourse');
const assignmentQuestionRoutes = require('./routes/assignmentQuestion');
const registrationRoutes = require('./routes/registration');
const errorController = require('./controller/error');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/question', questionRoutes);
app.use('/answer', answerRoutes);
app.use('/registration', registrationRoutes);
app.use('/course', courseRoute);
app.use('/facultycourse', facultyCourse);
app.use('/assignmentRoutes', assignmentRoutes);
app.use('/assignmentQuestionRoutes', assignmentQuestionRoutes);


app.use(errorController.get404);
app.use(errorController.get500);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
