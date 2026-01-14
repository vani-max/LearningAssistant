import React, { useState, useEffect } from 'react';
import { Save, Trash2, Plus } from 'lucide-react';
import documentService from '../../Services/documentService';
import { toast } from 'react-hot-toast';

const NotesEditor = ({ documentId }) => {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, [documentId]);

    const fetchNotes = async () => {
        try {
            const data = await documentService.getNotes(documentId);
            setNotes(data.notes || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!currentNote.trim()) return;
        try {
            const newNote = await documentService.addNote(documentId, { content: currentNote });
            setNotes([...notes, newNote.note]);
            setCurrentNote('');
            toast.success('Note saved');
        } catch (error) {
            toast.error('Failed to save note');
        }
    };

    const handleDelete = async (noteId) => {
        try {
            await documentService.deleteNote(documentId, noteId);
            setNotes(notes.filter(n => n._id !== noteId));
            toast.success('Note deleted');
        } catch (error) {
            toast.error('Failed to delete note');
        }
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800">Notes</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {notes.map((note) => (
                    <div key={note._id} className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 relative group">
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{note.content}</p>
                        <button
                            onClick={() => handleDelete(note._id)}
                            className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={14} />
                        </button>
                        <span className="text-xs text-gray-400 mt-2 block">
                            {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                ))}
                {notes.length === 0 && !loading && (
                    <p className="text-center text-gray-400 text-sm mt-8">No notes yet. Start typing below!</p>
                )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <textarea
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Type your note here..."
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none h-24 text-sm"
                />
                <button
                    onClick={handleSave}
                    disabled={!currentNote.trim()}
                    className="mt-2 w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition flex items-center justify-center"
                >
                    <Save size={16} className="mr-2" />
                    Save Note
                </button>
            </div>
        </div>
    );
};

export default NotesEditor;
