import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import flashcardService from '../../Services/flashcardSerive';
import FlashcardPlayer from '../../components/flashcards/FlashcardPlayer';
import { Loader2, ArrowLeft, Plus } from 'lucide-react';
import CreateFlashcardModal from '../../components/flashcards/CreateFlashcardModal';
import { toast } from 'react-hot-toast';

const FlashcardsPage = () => {
    const { id } = useParams(); // documentId
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const data = await flashcardService.getFlashcards(id);
                console.log("Flashcard Fetch Response:", data);
                setCards(data.data?.[0]?.cards || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCards();
    }, [id]);

    const handleRefresh = async () => {
        const data = await flashcardService.getFlashcards(id);
        setCards(data.data?.[0]?.cards || []);
    };

    if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="h-full flex flex-col p-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/flashcards')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Flashcard Deck</h1>
                        <p className="text-gray-500">{cards.length} cards</p>
                    </div>
                </div>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700"
                >
                    <Plus size={20} />
                    <span>Add Card</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <FlashcardPlayer cards={cards} />
            </div>

            <CreateFlashcardModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSave={async (data) => {
                    try {
                        await flashcardService.createFlashcard({
                            documentId: id,
                            ...data
                        });
                        toast.success('Card added');
                        handleRefresh();
                        setCreateModalOpen(false);
                    } catch (e) {
                        toast.error('Failed to add card');
                    }
                }}
            />
        </div>
    );
};

export default FlashcardsPage;
