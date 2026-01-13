import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Star, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FlashcardPlayer = ({ cards = [], onReview, onStar }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setCompleted(false);
    }, [cards]);

    const currentCard = cards[currentIndex];

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(c => c + 1), 200);
        } else {
            setCompleted(true);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(c => c - 1), 200);
        }
    };

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleReview = (quality) => {
        // quality: 1 (Hard), 2 (Medium), 3 (Easy) - simplified logic
        if (onReview) onReview(currentCard._id, quality);
        handleNext();
    };

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500 h-96 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p>No flashcards found.</p>
            </div>
        );
    }

    if (completed) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-96 bg-white rounded-xl shadow-lg border border-gray-100">
                <CheckCircle size={64} className="text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">You're all done!</h2>
                <p className="text-gray-600 mb-6">You've reviewed all {cards.length} cards in this set.</p>
                <button
                    onClick={() => {
                        setCurrentIndex(0);
                        setCompleted(false);
                        setIsFlipped(false);
                    }}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
                >
                    Restart Review
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6">
            {/* Progress */}
            <div className="w-full flex justify-between items-center text-sm font-medium text-gray-500">
                <span>Card {currentIndex + 1} of {cards.length}</span>
                {/* <span className="flex items-center space-x-1">
             <Star size={14} className={currentCard.isStarred ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
        </span> */}
            </div>

            {/* Card Container */}
            <div
                className="relative w-full aspect-[3/2] cursor-pointer perspective-1000"
                onClick={handleFlip}
            >
                <motion.div
                    className="w-full h-full relative"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl flex items-center justify-center p-8 border border-gray-100">
                        <h3 className="text-2xl font-serif text-center text-gray-800 leading-relaxed font-semibold">
                            {currentCard.question}
                        </h3>
                        <span className="absolute bottom-4 text-xs text-gray-400 uppercase tracking-widest font-semibold">Click to flip</span>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute w-full h-full backface-hidden bg-primary-50 rounded-2xl shadow-xl flex items-center justify-center p-8 border border-primary-100"
                        style={{ transform: "rotateY(180deg)" }}
                    >
                        <p className="text-xl text-center text-gray-700 leading-relaxed">
                            {currentCard.answer}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between w-full">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-3 rounded-full hover:bg-gray-100 disabled:opacity-30 text-gray-600 transition"
                >
                    <ChevronLeft size={24} />
                </button>

                {isFlipped ? (
                    <div className="flex space-x-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleReview('easy'); }}
                            className="px-6 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition"
                        >
                            Knwos it
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleReview('hard'); }}
                            className="px-6 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition"
                        >
                            Learn Again
                        </button>
                    </div>
                ) : (
                    <span className="text-gray-400 text-sm">Flip to rate</span>
                )}

                <button
                    onClick={handleNext}
                    disabled={currentIndex === cards.length - 1}
                    className="p-3 rounded-full hover:bg-gray-100 disabled:opacity-30 text-gray-600 transition"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default FlashcardPlayer;
