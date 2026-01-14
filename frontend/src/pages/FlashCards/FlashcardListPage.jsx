import React, { useEffect, useState } from 'react';
import flashcardService from '../../Services/flashcardSerive';
import { Loader2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FlashcardListPage = () => {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSets = async () => {
            try {
                const data = await flashcardService.getAllFlashcardSets();
                setSets(data.sets || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSets();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-primary-500" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 h-full flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Flashcards</h1>
                <p className="text-gray-500">Review your flashcard decks</p>
            </div>

            {sets.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">No Flashcards Yet</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">Upload a document and select text or use the "Create Flashcard" button to build your deck.</p>
                    <button
                        onClick={() => navigate('/documents')}
                        className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                    >
                        Go to Documents
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sets.map((set) => (
                        <div
                            key={set.documentId}
                            onClick={() => navigate(`/documents/${set.documentId}/flashcards`)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group"
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="bg-yellow-50 p-3 rounded-xl text-yellow-600 group-hover:scale-110 transition-transform">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 line-clamp-1">{set.documentTitle}</h3>
                                    <p className="text-xs text-gray-500">Flashcard Deck</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-50 pt-4">
                                <span>{set.count} Cards</span>
                                <span className="font-medium text-primary-600 group-hover:underline">Study Now →</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlashcardListPage;
