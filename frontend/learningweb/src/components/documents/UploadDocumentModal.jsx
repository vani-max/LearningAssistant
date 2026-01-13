import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';

const UploadDocumentModal = ({ isOpen, onClose, onUpload }) => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            if (!title) setTitle(selectedFile.name.replace('.pdf', ''));
        } else {
            alert('Please select a PDF file');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            if (!title) setTitle(selectedFile.name.replace('.pdf', ''));
        } else {
            alert('Please select a PDF file');
        }
    };

    const handleSubmit = async () => {
        if (!title || !file) return;
        setUploading(true);
        try {
            await onUpload({ title, file });
            setFile(null);
            setTitle('');
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Upload New Document</h2>
                        <p className="text-sm text-gray-500">Add a PDF document to your library</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Document Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
                            placeholder="e.g. React JS Concept Guide"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">PDF File</label>
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50'
                                }`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="application/pdf"
                                onChange={handleFileChange}
                            />

                            {file ? (
                                <div className="flex flex-col items-center text-primary-600">
                                    <FileText size={48} className="mb-2" />
                                    <span className="font-bold text-gray-800">{file.name}</span>
                                    <span className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}
                                        className="mt-4 text-xs text-red-500 hover:underline"
                                    >
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 bg-green-50 text-green-600 rounded-full mb-3">
                                        <Upload size={24} />
                                    </div>
                                    <p className="font-medium text-gray-700">Click to upload or drag and drop</p>
                                    <p className="text-sm text-gray-400 mt-1">PDF up to 10MB</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!title || !file || uploading}
                        className="px-8 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/30 flex items-center"
                    >
                        {uploading && <Loader2 size={18} className="animate-spin mr-2" />}
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadDocumentModal;
