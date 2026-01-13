import express from 'express'
import {
    getFlashcards,
    getAllFlashcardSets,
    reviewFlashcard,
    deleteFlashcardSet,
    toggleStarFlashcard,
    createFlashcard,
    deleteFlashcard
} from '../controller/flashcardController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllFlashcardSets);
router.get('/:documentId', getFlashcards);
router.post('/:cardId/review', reviewFlashcard);
router.put('/:cardId/star', toggleStarFlashcard);
router.put('/:cardId/star', toggleStarFlashcard);
router.delete('/:id', deleteFlashcardSet);
router.post('/create', createFlashcard);
router.delete('/:setId/cards/:cardId', deleteFlashcard);

export default router;