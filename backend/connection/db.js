const mongoose = require('mongoose');


const uri = 'mongodb://localhost:27017/mentorapp';


mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000,  
  socketTimeoutMS: 45000,          
})
.then(() => {
  console.log('Successfully connected to MongoDB');
})
.catch(err => {
  console.error('Error connecting to MongoDB', err);
});
