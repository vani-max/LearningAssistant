import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import quizService from '../../Services/quizService';
import QuizPlayer from '../../components/quizzes/QuizPlayer';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const QuiztakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getQuiz(quizId);
        setQuiz(data.data);
      } catch (e) {
        console.error("Failed to load quiz", e);
        toast.error("Failed to load quiz");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleSubmit = async (answers) => {
    try {
      const res = await quizService.submitQuiz(quizId, answers);
      return res.data; // Return result to Player to display
    } catch (e) {
      console.error("Submission failed", e);
      toast.error("Failed to submit quiz");
      throw e;
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary-500" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {quiz?.title || 'Quiz'}
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        {quiz && <QuizPlayer quiz={quiz} onSubmit={handleSubmit} />}
      </main>
    </div>
  );
};

export default QuiztakePage;