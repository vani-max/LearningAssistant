import express from 'express';
import {
    uploadDocument,
    getDocument,
    deleteDocument,
    getDocuments,
    addHighlight,
    getHighlights,
    deleteHighlight,
    addNote,
    getNotes,
    deleteNote,
    updateNote,
    searchDocument
} from '../controller/documentController.js';

import protect from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadDocument);
router.get('/', protect, getDocuments);
router.get('/:id', protect, getDocument);
router.delete('/:id', protect, deleteDocument);

// Highlights
router.post('/:id/highlights', protect, addHighlight);
router.get('/:id/highlights', protect, getHighlights);
router.delete('/:id/highlights/:highlightId', protect, deleteHighlight);

// Notes
router.post('/:id/notes', protect, addNote);
router.get('/:id/notes', protect, getNotes);
router.delete('/:id/notes/:noteId', protect, deleteNote);
router.put('/:id/notes/:noteId', protect, updateNote);

// Search
router.get('/:id/search', searchDocument);

export default router;
