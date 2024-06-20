const { body } = require('express-validator');

const loginValidator = [
    body('firstName').isEmpty().withMessage('First name is required'),
    body('lastName').isEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

module.exports = loginValidator;