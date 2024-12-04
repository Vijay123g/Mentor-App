const Registration = require('../model/registration');

exports.getAllRegistrations = async (req, res, next) => {
    try {
        const registrations = await Registration.getAll();
        res.status(200).json({ registrations });
    } catch (error) {
        console.error('Error fetching registrations:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.getRegistrationsByStudentId = async (req, res) => {
    const { studentId } = req.params;
    try {
        const registrations = await Registration.getByStudentId(studentId);
        res.status(200).json({ registrations });
    } catch (error) {
        console.error('Error fetching registrations:', error.message);
        res.status(500).json({ error: error.message });
    }
};


exports.createRegistration = async (req, res) => {
    const { studentId, facultyCourseId, registrationDate } = req.body;
  
    try {
      const result = await Registration.createRegistration({ studentId, facultyCourseId, registrationDate });
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating registration:', error.message);
      res.status(400).json({ error: error.message });
    }
  };

exports.deleteRegistration = async (req, res, next) => {
    const { registrationId } = req.params;
    try {
        const result = await Registration.deleteRegistration(registrationId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting registration:', error.message);
        res.status(500).json({ error: error.message });
    }
};
