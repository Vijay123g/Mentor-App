const express = require('express');
const { body } = require('express-validator');
const resultController = require('../controller/results');

const router = express.Router();

router.get('/', resultController.getAllResults);
router.get('/:attemptId', resultController.getResultByAttemptId);

router.post(
    '/',
    [
        body('attemptId').isInt().withMessage('Attempt ID is required'),
        body('totalScore').isInt().withMessage('Total score is required'),
        body('passed').isBoolean().withMessage('Pass status is required')
    ],
    resultController.createResult
);

router.put('/:resultId', resultController.updateResult);

router.delete('/:resultId', resultController.deleteResult);

module.exports = router;
