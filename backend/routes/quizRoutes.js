import express from 'express';
import {
    createQuiz,
    getQuizzes,
    getQuiz,
    submitQuiz,
    deleteQuiz
} from '../controller/quizController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/create', createQuiz);
router.get('/document/:documentId', getQuizzes);
router.get('/:id', getQuiz);
router.post('/:id/submit', submitQuiz);
router.delete('/:id', deleteQuiz);

export default router;
