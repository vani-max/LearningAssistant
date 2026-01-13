import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import flashcardService from '../../Services/flashcardSerive';
import { Loader2, ArrowLeft, Play, Trash2 } from 'lucide-react';

const FlashcardListPage = () => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const data = await flashcardService.getAllFlashcardSets(); 
        setSets(data.data || []);
      } catch (e) {
        console.error("Failed to fetch sets", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSets();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this flashcard set?")) return;
    try {
      await flashcardService.deleteFlashcardSet(id); 
      setSets(sets.filter(s => s._id !== id));
    } catch (e) {
      console.error("Failed to delete", e);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary-500" /></div>;

  return (
    <div className="min-h-full bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Flashcards</h1>
            <p className="text-gray-500">Review your study sets</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-700">Back to Dashboard</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sets.map(set => (
            <div
              key={set._id}
              onClick={() => navigate(`/flashcards/${set.documentId._id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <Play size={24} className="text-primary-600" fill="currentColor" />
                </div>
                <button
                  onClick={(e) => handleDelete(set._id, e)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                {set.documentId?.title || 'Untitled Document'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {set.cards?.length || 0} cards
              </p>

              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-green-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (set.cards.filter(c => c.reviewCount > 0).length / set.cards.length) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">
                {Math.round((set.cards.filter(c => c.reviewCount > 0).length / set.cards.length) * 100) || 0}% master
              </p>
            </div>
          ))}

          {sets.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              <p>No flashcard sets found. Create them from your documents!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardListPage;