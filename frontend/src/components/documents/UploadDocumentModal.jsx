import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';

const UploadDocumentModal = ({ isOpen, onClose, onUpload }) => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            setFile(droppedFile);
            // Auto-fill title if empty
            if (!title) setTitle(droppedFile.name.replace('.pdf', ''));
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            if (!title) setTitle(selectedFile.name.replace('.pdf', ''));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title) return;

        setUploading(true);
        await onUpload({ title, file });
        setUploading(false);
        setTitle('');
        setFile(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 relative animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Document</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Document Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                            placeholder="e.g., Biology Chapter 1"
                            required
                        />
                    </div>

                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
              ${isDragOver
                                ? 'border-primary-500 bg-primary-50'
                                : file
                                    ? 'border-primary-200 bg-primary-50/30'
                                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                            }
            `}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf"
                            className="hidden"
                        />

                        {file ? (
                            <div className="flex flex-col items-center">
                                <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                    <FileText className="text-primary-600" size={32} />
                                </div>
                                <p className="font-medium text-gray-900">{file.name}</p>
                                <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="bg-gray-100 p-3 rounded-full mb-3">
                                    <Upload className="text-gray-500" size={32} />
                                </div>
                                <p className="font-medium text-gray-700">Click to upload or drag and drop</p>
                                <p className="text-sm text-gray-400 mt-1">PDF files only</p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!file || !title || uploading}
                        className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" />
                                Uploading...
                            </>
                        ) : (
                            'Upload Document'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadDocumentModal;
