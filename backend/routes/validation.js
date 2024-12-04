const express = require('express');
const { body } = require('express-validator');
const validationController = require('../controller/validation');

const router = express.Router();

router.get('/', validationController.getAllValidations);
router.get('/:answerId', validationController.getValidationByAnswerId);

router.post(
    '/',
    [
        body('answerId').isInt().withMessage('Answer ID is required'),
        body('facultyId').optional().isInt().withMessage('Faculty ID should be an integer'),
        body('validationDate').isISO8601().withMessage('Validation date is required'),
        body('comments').optional().isString()
    ],
    validationController.createValidation
);

router.put('/:validationId', validationController.updateValidation);

router.delete('/:validationId', validationController.deleteValidation);

router.get('/validations', validationController.getValidationsWithAnswers);

module.exports = router;
