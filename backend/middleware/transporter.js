const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vijay.g.18.04.1999@gmail.com',
        pass: 'ivrxyjfjvxezoigi',  
    },
});

module.exports = transporter;
