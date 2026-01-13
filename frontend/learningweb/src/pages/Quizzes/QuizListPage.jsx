import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import quizService from '../../Services/quizService';
import QuizBuilder from '../../components/quizzes/QuizBuilder';
import { Loader2, ArrowLeft, Plus, Play, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

const QuizListPage = () => {
    const { id } = useParams(); // Document ID
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const fetchQuizzes = async () => {
        try {
            const data = await quizService.getQuizzes(id);
            setQuizzes(data.data || []);
        } catch (e) {
            console.error("Failed to fetch quizzes", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [id]);

    const handleCreateQuiz = async (quizData) => {
        try {
            await quizService.createQuiz({
                documentId: id,
                ...quizData
            });
            toast.success("Quiz created!");
            setIsCreating(false);
            fetchQuizzes();
        } catch (e) {
            toast.error("Failed to create quiz");
            console.error(e);
        }
    };

    const handleDelete = async (quizId, e) => {
        e.stopPropagation();
        if (!window.confirm("Delete this quiz?")) return;
        try {
            await quizService.deleteQuiz(quizId);
            setQuizzes(quizzes.filter(q => q._id !== quizId));
            toast.success("Quiz deleted");
        } catch (e) {
            toast.error("Failed to delete quiz");
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary-500" /></div>;

    if (isCreating) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
                <QuizBuilder
                    onSave={handleCreateQuiz}
                    onCancel={() => setIsCreating(false)}
                />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate(`/documents/${id}`)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">Quizzes</h1>
                            <p className="text-gray-500">Test your knowledge</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition shadow-sm"
                    >
                        <Plus size={20} />
                        <span>Create Quiz</span>
                    </button>
                </header>

                <div className="grid grid-cols-1 gap-4">
                    {quizzes.map(quiz => (
                        <div
                            key={quiz._id}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition flex justify-between items-center group cursor-pointer"
                            onClick={() => navigate(`/quizzes/${quiz._id}`)}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{quiz.title}</h3>
                                    <p className="text-sm text-gray-500">{quiz.questions.length} questions • {quiz.score ? `Best Score: ${quiz.score}/${quiz.totalQuestions}` : 'Not taken yet'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium group-hover:bg-primary-50 group-hover:text-primary-700 transition flex items-center">
                                    <Play size={16} className="mr-2" />
                                    Start
                                </button>
                                <button
                                    onClick={(e) => handleDelete(quiz._id, e)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {quizzes.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">No quizzes found for this document.</p>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="text-primary-600 font-medium hover:underline"
                            >
                                Create your first quiz
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizListPage;
