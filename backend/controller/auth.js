const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) return;

    const name = req.body.name;
    const email = req.body.email;
    const role = req.body.role;
    const password = req.body.password;

    try {
     const hashedPassword = await bcrypt.hash(password, 12);

        const userDetails = {
            name : name ,
            email : email,
            role : 'Student',
            password : hashedPassword,
        };

        const result = await User.save(userDetails);
        res.status(201).json({message: 'User Registered! '}) ;

    } catch(err){
        if(!err.statusCode){
            err.statusCode = 500;

        }
        next(err)
    }
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
      const user = await User.find(email);
  
      if (user[0].length !== 1) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
  
      const storedUser = user[0][0];
  
      const isEqual = await bcrypt.compare(password, storedUser.password);
  
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
  
      const token = jwt.sign(
        {
          email: storedUser.email,
          userId: storedUser.user_id,
          role: storedUser.role,
          name:storedUser.name,
        },
        'secretfortoken',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: storedUser.user_id,role: storedUser.role ,name:storedUser.name});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    } 
  };

  exports.createFaculty = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const facultyDetails = {
            name,
            email,
            password: hashedPassword
        };

        const result = await User.createFaculty(facultyDetails);
        res.status(201).json({ message: 'Faculty Member Created!' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.getFacultyDetails = async (req, res, next) => {
  try {
    const faculty = await User.findByRole('Faculty');
    res.status(200).json(faculty[0]);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};