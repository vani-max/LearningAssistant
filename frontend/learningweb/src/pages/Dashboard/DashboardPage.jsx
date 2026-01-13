import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import documentService from '../../Services/documentService';
import {
  BookOpen,
  FileText,
  Brain,
  Clock,
  Plus,
  Loader2,
  ChevronRight,
  Zap,
  GraduationCap
} from 'lucide-react';

const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDocs: 0,
    totalFlashcards: 0,
    totalQuizzes: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await documentService.getDocuments();

        const docs = data.documents || [];
        setDocuments(docs);

        const totalDocs = docs.length;
        const totalFlashcards = docs.reduce((acc, doc) => acc + (doc.flashcardCount || 0), 0);
        const totalQuizzes = docs.reduce((acc, doc) => acc + (doc.quizCount || 0), 0);

        setStats({ totalDocs, totalFlashcards, totalQuizzes });
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <span className="text-3xl font-bold text-gray-800">{value}</span>
      </div>
      <h3 className="text-gray-500 font-medium">{label}</h3>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back!</h1>
            <p className="text-gray-500">Here's an overview of your learning progress.</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/documents')}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              View All Documents
            </button>
            <button
              onClick={() => navigate('/documents')} 
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-sm transition flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Upload New
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={FileText}
            label="Documents"
            value={stats.totalDocs}
            color="bg-blue-500"
          />
          <StatCard
            icon={Zap}
            label="Flashcard Sets"
            value={documents.filter(d => d.flashcardCount > 0).length}
            color="bg-yellow-500"
          />
          <StatCard
            icon={GraduationCap}
            label="Quizzes Created"
            value={stats.totalQuizzes}
            color="bg-purple-500"
          />
        </div>

        {/* Recent Activity / Documents */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Clock size={20} className="mr-2 text-gray-400" />
              Recent Documents
            </h2>
            <button
              onClick={() => navigate('/documents')}
              className="text-primary-600 font-medium hover:underline text-sm flex items-center"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {documents.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {documents.slice(0, 5).map(doc => (
                  <div
                    key={doc._id}
                    onClick={() => navigate(`/documents/${doc._id}`)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition">
                          {doc.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(doc.updatedAt || doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center" title="Flashcards">
                        <Zap size={16} className="mr-1.5 text-yellow-500" />
                        {doc.flashcardCount || 0}
                      </div>
                      <div className="flex items-center" title="Quizzes">
                        <GraduationCap size={16} className="mr-1.5 text-purple-500" />
                        {doc.quizCount || 0}
                      </div>
                      <ChevronRight size={20} className="text-gray-300 group-hover:text-primary-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                <BookOpen size={48} className="mx-auto mb-3 opacity-20" />
                <p>No documents found. Start by uploading one!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;