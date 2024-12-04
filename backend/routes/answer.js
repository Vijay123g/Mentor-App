const express = require('express');
const examAnswerController = require('../controller/answer');

const router = express.Router();

router.post('/', examAnswerController.submitAnswer); 
router.get('/student/:studentId', examAnswerController.getAnswersByStudent);
router.put('/validate', examAnswerController.validateAnswer);
router.get('/faculty/:facultyId/answers', examAnswerController.getAnswersByFaculty);
router.get('/file/:fileId', examAnswerController.downloadFile); 

module.exports = router;
