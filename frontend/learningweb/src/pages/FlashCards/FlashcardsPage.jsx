import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import flashcardService from '../../Services/flashcardSerive';
import FlashcardPlayer from '../../components/flashcards/FlashcardPlayer';
import { ArrowLeft, Loader2 } from 'lucide-react';

const FlashcardsPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docTitle, setDocTitle] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await flashcardService.getFlashcards(id);

        const sets = data.data;
        if (sets && sets.length > 0) {
          const combinedCards = sets.flatMap(s => s.cards); 
          setCards(combinedCards);
          setDocTitle(sets[0].documentId?.title || 'Unknown Document');
        }
      } catch (e) {
        console.error("Failed to fetch cards", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary-500" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/flashcards')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {docTitle} <span className="text-gray-400 font-normal">/ Flashcards</span>
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
        <FlashcardPlayer
          cards={cards}
          onReview={async (cardId, quality) => {
            try {
              await flashcardService.reviewFlashcard(cardId);
            } catch (e) {
              console.error("Review failed", e);
            }
          }}
        />
      </main>
    </div>
  );
};

export default FlashcardsPage;