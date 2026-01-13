import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import documentService from '../../Services/documentService';
import PDFViewer from '../../components/documents/PDFViewer';
import NotesEditor from '../../components/documents/NotesEditor';
import ConceptExplorer from '../../components/documents/ConceptExplorer';
import CreateFlashcardModal from '../../components/flashcards/CreateFlashcardModal';
import flashcardService from '../../Services/flashcardSerive';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Loader2, BookOpen, PanelRight, Search } from 'lucide-react';

const DocumentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(true);
  const [showExplorer, setShowExplorer] = useState(false);
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [flashcardText, setFlashcardText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docData = await documentService.getDocument(id);
        setDocument(docData.document);

    
        const hlData = await documentService.getHighlights(id);
        setHighlights(hlData.highlights);

  
        const notesData = await documentService.getNotes(id);
        setNotes(notesData.notes);
      } catch (err) {
        console.error("Failed to fetch document:", err);
        setError("Failed to load document.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/dashboard'); 
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 space-y-4">
        <div className="text-red-500 text-lg font-medium">{error}</div>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#fcfbfc]">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 truncate max-w-xl">
            {document?.title || 'Untitled Document'}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setShowExplorer(!showExplorer);
              if (!showExplorer) setShowNotes(false);
            }}
            className={`p-2 rounded-lg transition-colors flex items-center space-x-2 ${showExplorer ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Concept Explorer"
          >
            <Search size={20} />
            <span className="text-sm font-medium hidden sm:inline">Search</span>
          </button>

          <button
            onClick={() => {
              setShowNotes(!showNotes);
              if (!showNotes) setShowExplorer(false);
            }}
            className={`p-2 rounded-lg transition-colors flex items-center space-x-2 ${showNotes ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <PanelRight size={20} />
            <span className="text-sm font-medium hidden sm:inline">Notes</span>
          </button>

          <button
            onClick={() => navigate(`/documents/${id}/quizzes`)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors flex items-center space-x-2"
            title="Quizzes"
          >
            <BookOpen size={20} />
            <span className="text-sm font-medium hidden sm:inline">Quizzes</span>
          </button>
        </div>
      </header>


      <main className="flex-1 overflow-hidden flex">

        <div className="flex-1 h-full p-4 relative">
          {document?.filePath && (
            <PDFViewer
              pdfUrl={document.filePath}
              highlights={highlights}
              onPageChange={(page) => setCurrentPage(page)}
              onCreateFlashcard={(text) => {
                setFlashcardText(text);
                setIsFlashcardModalOpen(true);
              }}
              onAddHighlight={async (data) => {
                try {
                  const res = await documentService.addHighlight(id, data);
                  setHighlights([...highlights, res.highlight]);
                } catch (e) {
                  console.error("Failed to add highlight", e);
                }
              }}
              onDeleteHighlight={async (hlId) => {
                try {
                  await documentService.deleteHighlight(id, hlId);
                  setHighlights(highlights.filter(h => h._id !== hlId));
                } catch (e) {
                  console.error("Failed to delete highlight", e);
                }
              }}
            />
          )}
        </div>

        {showNotes && (
          <NotesEditor
            notes={notes}
            currentPage={currentPage}
            onAddNote={async (noteData) => {
              try {
                const res = await documentService.addNote(id, noteData);
                setNotes([res.note, ...notes]);
              } catch (e) { console.error(e); }
            }}
            onDeleteNote={async (noteId) => {
              try {
                await documentService.deleteNote(id, noteId);
                setNotes(notes.filter(n => n._id !== noteId));
              } catch (e) { console.error(e); }
            }}
            onUpdateNote={async (noteId, content) => {
              try {
                const res = await documentService.updateNote(id, noteId, content);
                setNotes(notes.map(n => n._id === noteId ? res.note : n));
              } catch (e) { console.error(e); }
            }}
          />
        )}

        {showExplorer && (
          <ConceptExplorer
            onSearch={(query) => documentService.searchDocument(id, query)}
            onNavigate={(page) => setCurrentPage(page)}
            onClose={() => setShowExplorer(false)}
          />
        )}

        {/* Flashcard Modal */}
        <CreateFlashcardModal
          isOpen={isFlashcardModalOpen}
          onClose={() => setIsFlashcardModalOpen(false)}
          initialQuestion={flashcardText}
          onSave={async (data) => {
            try {
              await flashcardService.createFlashcard({
                documentId: id,
                ...data
              });
              toast.success('Flashcard created!');
              setIsFlashcardModalOpen(false);
            } catch (e) {
              toast.error('Failed to create flashcard');
            }
          }}
        />
      </main>
    </div>
  );
};

export default DocumentDetailsPage;