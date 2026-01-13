import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const CreateFlashcardModal = ({ isOpen, onClose, onSave, initialQuestion = '' }) => {
    const [question, setQuestion] = useState(initialQuestion);
    const [answer, setAnswer] = useState('');

    // Update question when initialQuestion changes
    React.useEffect(() => {
        setQuestion(initialQuestion);
    }, [initialQuestion]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ question, answer });
        setAnswer('');
        // Don't clear question immediately or close automatically if we want to add multiple? 
        // Usually close.
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Create Flashcard</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question (Front)</label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-24 resize-none"
                            placeholder="Enter question..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Answer (Back)</label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-24 resize-none"
                            placeholder="Enter answer..."
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!question.trim() || !answer.trim()}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center"
                        >
                            <Check size={18} className="mr-2" />
                            Create Card
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFlashcardModal;
