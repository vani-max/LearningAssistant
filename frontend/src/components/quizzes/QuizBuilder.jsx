import React, { useState } from 'react';
import { Plus, Trash2, Save, X, Check } from 'lucide-react';

const QuizBuilder = ({ onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([
        { question: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }
    ]);

    const addQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }]);
    };

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        // If we changed the option text that was the correct answer, update correct answer too? 
        // Usually easier to store correct answer as the string value or index. 
        // Backend schema says `correctAnswer: String`.
        setQuestions(newQuestions);
    };

    const setCorrectAnswer = (qIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = () => {
        // Validation
        if (!title.trim()) return alert("Title is required");
        for (let q of questions) {
            if (!q.question.trim()) return alert("All questions must have text");
            if (q.options.some(o => !o.trim())) return alert("All options must be filled");
            if (!q.correctAnswer) return alert("Select a correct answer for all questions");
        }

        onSave({ title, questions });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create Quiz</h2>
                <button onClick={onCancel} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
                    <X size={24} />
                </button>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="e.g. Chapter 1 Review"
                />
            </div>

            <div className="space-y-8">
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => removeQuestion(qIndex)}
                                disabled={questions.length === 1}
                                className="text-gray-400 hover:text-red-500 disabled:opacity-30"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div className="mb-4 pr-10">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Question {qIndex + 1}</label>
                            <input
                                type="text"
                                value={q.question}
                                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Enter question text..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {q.options.map((opt, oIndex) => (
                                <div key={oIndex} className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCorrectAnswer(qIndex, opt)}
                                        className={`p-2 rounded-full border ${q.correctAnswer === opt && opt !== '' ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-300 hover:border-gray-400'}`}
                                        title="Mark as correct"
                                        disabled={!opt}
                                    >
                                        <Check size={14} />
                                    </button>
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                        className={`flex-1 p-2 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 ${q.correctAnswer === opt && opt !== '' ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-300'}`}
                                        placeholder={`Option ${oIndex + 1}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Explanation (Optional)</label>
                            <textarea
                                value={q.explanation}
                                onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                                className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-16 resize-none"
                                placeholder="Explain why the answer is correct..."
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
                <button
                    onClick={addQuestion}
                    className="flex items-center space-x-2 text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-medium transition"
                >
                    <Plus size={20} />
                    <span>Add Question</span>
                </button>

                <div className="flex space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-md transition"
                    >
                        Save Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizBuilder;
