import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const PDFViewer = ({ url, onTextSelection, highlights = [], onCreateFlashcard }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [rotation, setRotation] = useState(0);
    const [selectionTooltip, setSelectionTooltip] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setSelectionTooltip({
                x: rect.left + (rect.width / 2),
                y: rect.top - 10,
                text: selection.toString()
            });

            if (onTextSelection) {
                onTextSelection(selection.toString());
            }
        } else {
            setSelectionTooltip(null);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200" onMouseUp={handleTextSelection}>
            {/* Toolbar */}
            <div className="bg-white p-2 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                        disabled={pageNumber <= 1}
                        className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium text-gray-600">
                        Page {pageNumber} of {numPages || '--'}
                    </span>
                    <button
                        onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                        disabled={pageNumber >= numPages}
                        className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-1 hover:bg-gray-100 rounded-lg">
                        <ZoomOut size={20} />
                    </button>
                    <span className="text-sm font-medium text-gray-600 w-12 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button onClick={() => setScale(s => Math.min(s + 0.2, 2.0))} className="p-1 hover:bg-gray-100 rounded-lg">
                        <ZoomIn size={20} />
                    </button>
                    <div className="w-px h-6 bg-gray-200 mx-2" />
                    <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-1 hover:bg-gray-100 rounded-lg">
                        <RotateCw size={20} />
                    </button>
                </div>
            </div>

            {/* PDF Container */}
            <div className="flex-1 overflow-auto flex justify-center p-4 relative">
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="shadow-lg"
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        rotate={rotation}
                        className="flex justify-center bg-white"
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        customTextRenderer={({ str, itemIndex }) => {
                            // Basic implementation
                            return str;
                        }}
                    />
                </Document>

                {/* Selection Tooltip */}
                {selectionTooltip && (
                    <div
                        className="fixed z-50 bg-gray-900 text-white px-3 py-1.5 rounded-lg shadow-xl text-sm flex items-center space-x-2 transform -translate-x-1/2 -translate-y-full"
                        style={{ left: selectionTooltip.x, top: selectionTooltip.y }}
                    >
                        <button
                            onClick={() => onCreateFlashcard(selectionTooltip.text)}
                            className="hover:text-primary-300 font-medium"
                        >
                            Create Flashcard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFViewer;
