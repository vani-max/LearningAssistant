import express from 'express';
import {body} from 'express-validator';

import {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
} from '../controller/authController.js';

import protect from '../middleware/auth.js';

const router = express.Router();

const registerValidation = [
    body('username')
    .trim()
    .isLength({min: 3})
    .withMessage('Username must be at least 3 characters long'),
    body('email')
    .isEmail()
    .withMessage('Invalid email address'),
    body('password')
    .isLength({min: 6})
    .withMessage('Password must be at least 6 characters long'),
]

const loginValidation = [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
    body('password')
    .notEmpty()
    .withMessage('Password must not be empty'),
]

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);

export default router;