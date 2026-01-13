import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import documentService from '../../Services/documentService';
import UploadDocumentModal from '../../components/documents/UploadDocumentModal';
import CreateFlashcardModal from '../../components/flashcards/CreateFlashcardModal'; // Import Flashcard Modal
import flashcardService from '../../Services/flashcardSerive'; // Import Flashcard Service
import { FileText, Plus, Search, Loader2, Zap } from 'lucide-react'; // Add Zap icon
import { toast } from 'react-hot-toast';

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDocForFlashcard, setSelectedDocForFlashcard] = useState(null); // State for flashcard modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await documentService.getDocuments();
        setDocuments(data.documents || []);
      } catch (error) {
        console.error("Failed to fetch documents", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const refreshDocs = async () => {
    setLoading(true);
    try {
      const data = await documentService.getDocuments();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
          <p className="text-gray-500">Manage and organize your learning materials</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition shadow-sm font-medium"
        >
          <Plus size={20} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {documents.map((doc) => (
          <div
            key={doc._id}
            onClick={() => navigate(`/documents/${doc._id}`)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group flex flex-col"
          >
            <div className="p-4 bg-primary-50 text-primary-600 rounded-xl w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1" title={doc.title}>
              {doc.title}
            </h3>
            <div className="text-xs text-gray-400 mb-4 bg-gray-50 p-2 rounded-lg inline-block self-start">
              {(doc.fileSize / 1024 / 1024).toFixed(1)} MB
            </div>

            <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    {doc.flashcardCount || 0} Flashcards
                  </span>
                  <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                    {doc.quizCount || 0} Quizzes
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDocForFlashcard(doc);
                }}
                className="w-full py-2 bg-gray-50 hover:bg-primary-50 hover:text-primary-600 text-gray-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white"
              >
                <Zap size={16} className="mr-2" />
                Create Flashcard
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-400 flex items-center">
              Uploaded {new Date(doc.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}

        {/* Upload Placeholder Card */}
        <button
          onClick={() => setIsUploadOpen(true)}
          className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-primary-400 hover:text-primary-500 hover:bg-primary-50/50 transition h-full min-h-[250px]"
        >
          <div className="p-4 bg-gray-50 rounded-full mb-4">
            <Plus size={32} />
          </div>
          <span className="font-medium">Upload New Document</span>
        </button>
      </div>

      <UploadDocumentModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={async ({ title, file }) => {
          const formData = new FormData();
          formData.append('title', title);
          formData.append('file', file);

          try {
            await documentService.uploadDocument(formData);
            toast.success('Document uploaded!');
            refreshDocs();
          } catch (e) {
            toast.error('Failed to upload document');
            console.error(e);
          }
        }}
      />

      {/* Flashcard Modal */}
      <CreateFlashcardModal
        isOpen={!!selectedDocForFlashcard}
        onClose={() => setSelectedDocForFlashcard(null)}
        initialQuestion=""
        onSave={async (data) => {
          try {
            await flashcardService.createFlashcard({
              documentId: selectedDocForFlashcard._id,
              ...data
            });
            toast.success('Flashcard created!');
            refreshDocs(); // Refresh to update count
            setSelectedDocForFlashcard(null);
          } catch (e) {
            toast.error('Failed to create flashcard');
            console.error(e);
          }
        }}
      />
    </div>
  );
};

export default DocumentListPage;