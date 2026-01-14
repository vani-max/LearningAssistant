import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const FlashcardPlayer = ({ cards = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [rating, setRating] = useState(null); // Simple self-rating

    if (!cards || cards.length === 0) {
        return <div className="text-center p-8 text-gray-500">No cards in this deck.</div>;
    }

    const currentCard = cards[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setRating(null);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setRating(null);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4">
            {/* Progress */}
            <div className="w-full flex justify-between text-sm text-gray-500 mb-4 font-medium">
                <span>Card {currentIndex + 1} of {cards.length}</span>
                <span>{Math.round(((currentIndex + 1) / cards.length) * 100)}% Completed</span>
            </div>

            <div className="w-full h-1 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-primary-500 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                />
            </div>

            {/* Card Area */}
            <div
                className="w-full h-80 relative cursor-pointer perspective-1000"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden bg-white border border-gray-200 shadow-lg rounded-2xl flex flex-col items-center justify-center p-8">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Question</span>
                        <p className="text-xl font-medium text-gray-800 leading-relaxed overflow-y-auto max-h-56 w-full custom-scrollbar">
                            {currentCard.question}
                        </p>
                        <p className="absolute bottom-4 text-xs text-gray-400">Click to flip</p>
                    </div>

                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden bg-white border border-primary-200 shadow-xl rounded-2xl flex flex-col items-center justify-center p-8 rotate-y-180">
                        <span className="text-xs font-bold text-primary-500 uppercase tracking-wider mb-4">Answer</span>
                        <p className="text-lg text-gray-700 leading-relaxed overflow-y-auto max-h-56 w-full custom-scrollbar">
                            {currentCard.answer}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between w-full mt-8">
                <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 shadow-sm text-gray-600 transition"
                >
                    <ChevronLeft size={24} />
                </button>

                {isFlipped ? (
                    <div className="flex space-x-4">
                        <button onClick={handleNext} className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium">Hard</button>
                        <button onClick={handleNext} className="px-6 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 font-medium">Good</button>
                        <button onClick={handleNext} className="px-6 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium">Easy</button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsFlipped(true)}
                        className="px-8 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium"
                    >
                        Show Answer
                    </button>
                )}

                <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 shadow-sm text-gray-600 transition"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default FlashcardPlayer;
