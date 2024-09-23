const express = require('express');

const bodyParser = require('body-parser');

const authRuotes = require('./routes/auth');

const adminRuotes = require('./routes/admin');

const questionRuotes = require('./routes/question');

const answerRuotes = require('./routes/answer');

const registrationRoutes = require('./routes/registration');

const app = express();

const ports = process.env.PORT || 3000;

const errorController = require('./controller/error');

app.use(bodyParser.json());

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type , Authorization');
    next();

})

app.use('/auth',authRuotes);

app.use('/admin',adminRuotes);

app.use('/question',questionRuotes);

app.use('/answer',answerRuotes);

app.use('/registration',registrationRoutes);

app.use(errorController.get404);

app.use(errorController.get500);

app.listen(ports,() => console.log(`Lising on port ${ports}`))