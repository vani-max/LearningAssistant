import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Save, Trash2, Edit2, Plus } from 'lucide-react';

const NotesEditor = ({ notes, onAddNote, onDeleteNote, onUpdateNote, currentPage }) => {
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [editorContent, setEditorContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Filter notes for current page (or show all if needed, but per-page is better for context)
    // For now let's show all notes, sorted by page
    const sortedNotes = [...notes].sort((a, b) => (a.pageNumber || 0) - (b.pageNumber || 0));

    const handleSave = () => {
        if (!editorContent.trim()) return;

        if (activeNoteId) {
            onUpdateNote(activeNoteId, editorContent);
        } else {
            onAddNote({
                content: editorContent,
                pageNumber: currentPage
            });
        }
        setEditorContent('');
        setActiveNoteId(null);
        setIsEditing(false);
    };

    const startEdit = (note) => {
        setActiveNoteId(note._id);
        setEditorContent(note.content);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setActiveNoteId(null);
        setEditorContent('');
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col h-full bg-white border-l border-gray-200 shadow-xl w-96 transition-all duration-300">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h2 className="font-semibold text-gray-800">Notes</h2>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    Page {currentPage}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Editor Area */}
                {(isEditing || activeNoteId === null) && (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-primary-300 transition-shadow">
                        <textarea
                            className="w-full h-32 resize-none outline-none text-sm text-gray-700 placeholder-gray-400"
                            placeholder={`Add a note for page ${currentPage}...`}
                            value={editorContent}
                            onChange={(e) => setEditorContent(e.target.value)}
                        />
                        <div className="flex justify-end mt-2 space-x-2">
                            {isEditing && (
                                <button
                                    onClick={cancelEdit}
                                    className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={!editorContent.trim()}
                                className="px-3 py-1 flex items-center text-xs bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50 transition-colors"
                            >
                                <Save size={14} className="mr-1" />
                                {isEditing ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Notes List */}
                <div className="space-y-3">
                    {sortedNotes.map(note => (
                        <div key={note._id} className="group relative bg-gray-50 rounded-lg p-3 border border-transparent hover:border-gray-200 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-500">
                                    Page {note.pageNumber}
                                </span>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => startEdit(note)}
                                        className="p-1 text-gray-400 hover:text-blue-500"
                                    >
                                        <Edit2 size={12} />
                                    </button>
                                    <button
                                        onClick={() => onDeleteNote(note._id)}
                                        className="p-1 text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>

                            <div className="prose prose-sm prose-gray max-w-none text-gray-700 text-sm">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {note.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotesEditor;
