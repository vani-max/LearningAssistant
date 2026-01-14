import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import documentService from '../../Services/documentService';
import PDFViewer from '../../components/documents/PDFViewer';
import NotesEditor from '../../components/documents/NotesEditor';
import ConceptExplorer from '../../components/documents/ConceptExplorer';
import CreateFlashcardModal from '../../components/flashcards/CreateFlashcardModal';
import flashcardService from '../../Services/flashcardSerive';
import { Loader2, ArrowLeft, BookOpen, BrainCircuit } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DocumentDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('notes'); // notes | concepts
    const [flashcardModalOpen, setFlashcardModalOpen] = useState(false);
    const [selectedText, setSelectedText] = useState('');

    useEffect(() => {
        const fetchDoc = async () => {
            try {
                const data = await documentService.getDocument(id);
                setDocument(data.document);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load document");
            } finally {
                setLoading(false);
            }
        };
        fetchDoc();
    }, [id]);

    const handleCreateFlashcard = (text) => {
        setSelectedText(text);
        setFlashcardModalOpen(true);
    };

    if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>;
    if (!document) return <div>Document not found</div>;

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/documents')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 truncate max-w-xl" title={document.title}>{document.title}</h1>
                </div>

                <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'notes' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <div className="flex items-center space-x-2">
                            <BookOpen size={16} />
                            <span>Notes</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('concepts')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'concepts' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <div className="flex items-center space-x-2">
                            <BrainCircuit size={16} />
                            <span>Explorer</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* PDF Viewer - Main Area */}
                <div className="flex-1 p-4 overflow-hidden">
                    <PDFViewer
                        url={document.filePath} // Ensure backend serves file correctly
                        onCreateFlashcard={handleCreateFlashcard}
                    />
                </div>

                {/* Sidebar */}
                <div className="w-96 border-l border-gray-200 bg-white flex flex-col shrink-0">
                    <div className="flex-1 overflow-hidden p-4">
                        {activeTab === 'notes' ? (
                            <NotesEditor documentId={id} />
                        ) : (
                            <ConceptExplorer documentId={id} />
                        )}
                    </div>
                </div>
            </div>

            <CreateFlashcardModal
                isOpen={flashcardModalOpen}
                onClose={() => setFlashcardModalOpen(false)}
                initialQuestion={selectedText}
                onSave={async (data) => {
                    try {
                        await flashcardService.createFlashcard({
                            documentId: id,
                            ...data
                        });
                        toast.success('Flashcard created!');
                        setFlashcardModalOpen(false);
                    } catch (e) {
                        toast.error('Failed to create flashcard');
                    }
                }}
            />
        </div>
    );
};

export default DocumentDetailsPage;
