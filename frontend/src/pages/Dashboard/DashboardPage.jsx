import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import documentService from '../../Services/documentService';
import flashcardService from '../../Services/flashcardSerive';
import quizService from '../../Services/quizService';
import { FileText, Zap, BrainCircuit, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className={`p-4 rounded-xl ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

const DashboardPage = () => {
    const [stats, setStats] = useState({
        documents: 0,
        flashcards: 0,
        quizzes: 0
    });
    const [recentDocs, setRecentDocs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docsData = await documentService.getDocuments();
                // Assuming we could better aggregate totals from endpoints or calculate here
                // For now, simple length based on list responses might be heavy if lists are long, 
                // but fine for MVP
                const docs = docsData.documents || [];

                // Mocking or fetching flashcard totals per doc is complex without specific endpoint. 
                // We can just sum up from the docs list which has counts.
                const totalFlashcards = docs.reduce((acc, doc) => acc + (doc.flashcardCount || 0), 0);
                const totalQuizzes = docs.reduce((acc, doc) => acc + (doc.quizCount || 0), 0);

                setStats({
                    documents: docs.length,
                    flashcards: totalFlashcards,
                    quizzes: totalQuizzes
                });

                setRecentDocs(docs.slice(0, 3)); // Top 3 most recent
            } catch (error) {
                console.error("Dashboard fetch error", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-500">Overview of your learning progress</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Documents"
                    value={stats.documents}
                    icon={FileText}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Flashcards Created"
                    value={stats.flashcards}
                    icon={Zap}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="Quizzes Taken"
                    value={stats.quizzes}
                    icon={BrainCircuit}
                    color="bg-purple-500"
                />
            </div>

            {/* Recent Activity / Documents */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Recent Documents</h2>
                    <button
                        onClick={() => navigate('/documents')}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                        View All
                    </button>
                </div>

                <div className="space-y-4">
                    {recentDocs.length > 0 ? (
                        recentDocs.map(doc => (
                            <div
                                key={doc._id}
                                onClick={() => navigate(`/documents/${doc._id}`)}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition border border-gray-100"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{doc.title}</h4>
                                        <p className="text-xs text-gray-500">
                                            {(doc.fileSize / 1024 / 1024).toFixed(1)} MB
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-400 text-sm">
                                    <Clock size={16} className="mr-2" />
                                    {new Date(doc.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">No documents uploaded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
