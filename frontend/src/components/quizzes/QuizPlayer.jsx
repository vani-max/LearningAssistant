import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

const QuizPlayer = ({ quiz, onSubmit }) => {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { 0: 'Option A', 1: 'Option B' }
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);

    const handleSelect = (option) => {
        if (submitted) return;
        setAnswers({ ...answers, [currentQIndex]: option });
    };

    const handleNext = () => {
        if (currentQIndex < quiz.questions.length - 1) {
            setCurrentQIndex(c => c + 1);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        // Format answers for submission
        const submission = Object.keys(answers).map(idx => ({
            questionIndex: parseInt(idx),
            selectedAnswer: answers[idx]
        }));

        const res = await onSubmit(submission);
        setResult(res);
        setSubmitted(true);
    };

    const restartKey = () => {
        setAnswers({});
        setSubmitted(false);
        setResult(null);
        setCurrentQIndex(0);
    };

    const currentQ = quiz.questions[currentQIndex];

    if (submitted && result) {
        return (
            <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-4">
                        <CheckCircle size={48} className="text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
                    <p className="text-gray-500">You scored {result.score} out of {result.total}</p>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-4 mb-8 overflow-hidden">
                    <div
                        className="bg-blue-600 h-full transition-all duration-1000 ease-out"
                        style={{ width: `${(result.score / result.total) * 100}%` }}
                    />
                </div>

                <div className="flex justify-center space-x-4">
                    {/* <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      Review Answers
                  </button> */}
                    <button
                        onClick={restartKey}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
                    >
                        <RotateCcw size={18} className="mr-2" />
                        Retry Quiz
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                    <span>Question {currentQIndex + 1} of {quiz.questions.length}</span>
                    <span>{Math.round(((currentQIndex + (answers[currentQIndex] ? 1 : 0)) / quiz.questions.length) * 100)}% completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-primary-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${((currentQIndex + 1) / quiz.questions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300 key={currentQIndex}">
                <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
                    {currentQ.question}
                </h3>

                <div className="space-y-3">
                    {currentQ.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelect(option)}
                            className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex justify-between items-center group
                            ${answers[currentQIndex] === option
                                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                                    : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                                }`}
                        >
                            <span className="font-medium">{option}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${answers[currentQIndex] === option
                                    ? 'border-primary-500 bg-primary-500'
                                    : 'border-gray-300 group-hover:border-primary-300'
                                }`}
                            >
                                {answers[currentQIndex] === option && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={!answers[currentQIndex]}
                    className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition flex items-center shadow-lg shadow-primary-500/20"
                >
                    {currentQIndex === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                    <ArrowRight size={20} className="ml-2" />
                </button>
            </div>
        </div>
    );
};

export default QuizPlayer;
