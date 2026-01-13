import Flashcard from "../models/Flashcard.js";

export const getFlashcards = async (req, res, next) => {
    try {
        const flashcards = await Flashcard.find({ documentId: req.params.documentId, userId: req.user.id })
        .populate("documentId", "title filename")
        .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: flashcards
        });
    } catch (error) {
        next(error);
    }
};


export const getAllFlashcardSets = async (req, res, next) => {
    try {
        const flashcardSets = await Flashcard.find({ userId: req.user.id }).populate("documentId", "title").sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: flashcardSets,
            count : flashcardSets.length
        });
    } catch (error) {
        next(error);
    }
};

export const reviewFlashcard = async (req, res, next) => {
    try {
        const flashcardSet = await Flashcard.findOne({'cards._id': req.params.cardId , userId: req.user.id });
        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                error: "Flashcard not found"
            });
        }

        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);
        if (cardIndex === -1) {
            return res.status(404).json({
                success: false,
                error: "Card not found"
            });
        }

        flashcardSet.cards[cardIndex].lastReviewed = new Date();
        flashcardSet.cards[cardIndex].reviewCount += 1;
        await flashcardSet.save();

        res.status(200).json({
            success: true,
            data: flashcardSet,
            message: "Flashcard reviewed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const toggleStarFlashcard = async (req, res, next) => {
    try {
        const flashcardSet = await Flashcard.findOne({'cards._id': req.params.cardId , userId: req.user.id });
        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                error: "Flashcard not found"
            });
        }

        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);
        if (cardIndex === -1) {
            return res.status(404).json({
                success: false,
                error: "Card not found"
            });
        }

        flashcardSet.cards[cardIndex].isStarred = !flashcardSet.cards[cardIndex].isStarred;
        await flashcardSet.save();

        res.status(200).json({
            success: true,
            data: flashcardSet,
            message : flashcardSet.cards[cardIndex].isStarred ? "Flashcard starred successfully" : "Flashcard unstarred successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const deleteFlashcardSet = async (req, res, next) => {
    try {
        const flashcardSet = await Flashcard.findOne({ _id: req.params.id, userId: req.user.id });
        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                error: "Flashcard set not found"
            });
        }

        await flashcardSet.deleteOne();

        res.status(200).json({
            success: true, 
            message: "Flashcard set deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const createFlashcard = async (req, res, next) => {
    try {
        const { documentId, question, answer } = req.body;
        
        let flashcardSet = await Flashcard.findOne({ documentId, userId: req.user.id });
        
        if (!flashcardSet) {
            flashcardSet = await Flashcard.create({
                userId: req.user.id,
                documentId,
                cards: []
            });
        }

        flashcardSet.cards.push({
            question,
            answer,
            difficulty: 'medium'
        });

        await flashcardSet.save();

        res.status(201).json({
            success: true,
            data: flashcardSet,
            newCard: flashcardSet.cards[flashcardSet.cards.length - 1]
        });
    } catch (error) {
        next(error);
    }
};

export const deleteFlashcard = async (req, res, next) => {
    try {
        const { setId, cardId } = req.params;
        const flashcardSet = await Flashcard.findOne({ _id: setId, userId: req.user.id });
        
        if (!flashcardSet) {
            return res.status(404).json({ success: false, error: "Flashcard set not found" });
        }

        flashcardSet.cards = flashcardSet.cards.filter(card => card._id.toString() !== cardId);
        await flashcardSet.save();

        res.status(200).json({ success: true, message: "Card deleted" });
    } catch (error) {
        next(error);
    }
};
