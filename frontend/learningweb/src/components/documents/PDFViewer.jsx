import { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Highlighter, Trash2 } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const PDFViewer = ({ pdfUrl, highlights = [], onAddHighlight, onDeleteHighlight, onPageChange, onCreateFlashcard }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [rotation, setRotation] = useState(0);
    const [selection, setSelection] = useState(null);
    const containerRef = useRef(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const changePage = (offset) => {
        setPageNumber((prevPageNumber) => {
            const newPage = prevPageNumber + offset;
            if (newPage >= 1 && newPage <= (numPages || 1)) {
                onPageChange && onPageChange(newPage);
                setSelection(null); // Clear selection on page change
                return newPage;
            }
            return prevPageNumber;
        });
    };

    const handleTextSelection = () => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
            setSelection(null);
            return;
        }

        const range = sel.getRangeAt(0);
        const text = sel.toString();

        // Check if selection is inside a PDF page
        const pageElement = range.commonAncestorContainer.parentElement.closest('.react-pdf__Page');
        if (!pageElement) return;

        const pageRect = pageElement.getBoundingClientRect();
        const selectionRect = range.getBoundingClientRect();

        // Calculate relative coordinates (percentage or pixels relative to page)
        // Here we use relative to page dimensions to handle zoom/resize
        const rect = {
            x: (selectionRect.left - pageRect.left) / scale,
            y: (selectionRect.top - pageRect.top) / scale,
            width: selectionRect.width / scale,
            height: selectionRect.height / scale,
            pageWidth: pageRect.width / scale,
            pageHeight: pageRect.height / scale
        };

        setSelection({
            text,
            rect,
            pageNumber, // Assuming single page view for now, or use pageElement's data-page-number
            viewportRect: selectionRect // For positioning the tooltip
        });
    };

    const confirmHighlight = () => {
        if (selection && onAddHighlight) {
            onAddHighlight({
                content: selection.text,
                pageNumber: selection.pageNumber,
                position: {
                    boundingRect: {
                        x1: selection.rect.x,
                        y1: selection.rect.y,
                        x2: selection.rect.x + selection.rect.width,
                        y2: selection.rect.y + selection.rect.height,
                        width: selection.rect.width,
                        height: selection.rect.height
                    },
                    rects: [] // Simplify for now
                },
                color: '#fff59d' // default yellow
            });
            setSelection(null);
            window.getSelection().removeAllRanges();
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 border rounded-xl overflow-hidden shadow-sm relative" ref={containerRef}>
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 bg-white border-b border-gray-100 z-10">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => changePage(-1)}
                        disabled={pageNumber <= 1}
                        className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                        <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                        {pageNumber} / {numPages || '--'}
                    </span>
                    <button
                        onClick={() => changePage(1)}
                        disabled={pageNumber >= numPages}
                        className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                        <ChevronRight size={20} className="text-gray-600" />
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <span className="text-xs font-medium text-gray-500 min-w-[3rem] text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={() => setScale(s => Math.min(2.5, s + 0.1))}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                        <ZoomIn size={18} />
                    </button>
                    <div className="w-px h-4 bg-gray-200 mx-2" />
                    <button
                        onClick={() => setRotation(r => (r + 90) % 360)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                        <RotateCw size={18} />
                    </button>
                </div>
            </div>

            {/* PDF Content */}
            <div
                className="flex-1 overflow-auto flex justify-center p-4 relative"
                onMouseUp={handleTextSelection}
            >
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex items-center justify-center h-64 w-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        </div>
                    }
                    className="flex flex-col items-center shadow-lg relative"
                >
                    <div className="relative">
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            rotate={rotation}
                            className="bg-white"
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                        />

                        {/* Render Highlights Overlay */}
                        {highlights.filter(h => h.pageNumber === pageNumber).map((h, i) => (
                            <div
                                key={h._id || i}
                                className="absolute mix-blend-multiply cursor-pointer group"
                                style={{
                                    left: h.position.boundingRect.x1 * scale,
                                    top: h.position.boundingRect.y1 * scale,
                                    width: h.position.boundingRect.width * scale,
                                    height: h.position.boundingRect.height * scale,
                                    backgroundColor: h.color || '#ffeb3b',
                                    opacity: 0.4
                                }}
                            >
                                {onDeleteHighlight && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteHighlight(h._id); }}
                                        className="absolute -top-6 left-0 bg-white shadow-md p-1 rounded hover:bg-red-50 hidden group-hover:flex"
                                    >
                                        <Trash2 size={12} className="text-red-500" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </Document>

                {/* Selection Tooltip */}
                {selection && (
                    <div
                        className="fixed z-50 bg-white shadow-xl border border-gray-200 rounded-lg p-2 flex items-center space-x-2 animate-in fade-in zoom-in duration-200"
                        style={{
                            left: selection.viewportRect.left + (selection.viewportRect.width / 2) - 50,
                            top: selection.viewportRect.top - 50
                        }}
                    >
                        <button
                            onClick={confirmHighlight}
                            className="flex items-center space-x-1 px-2 py-1 hover:bg-yellow-50 rounded text-sm font-medium text-gray-700"
                        >
                            <Highlighter size={16} className="text-yellow-500" />
                            <span>Highlight</span>
                        </button>
                        {onCreateFlashcard && (
                            <button
                                onClick={() => {
                                    onCreateFlashcard(selection.text);
                                    setSelection(null);
                                    window.getSelection().removeAllRanges();
                                }}
                                className="flex items-center space-x-1 px-2 py-1 hover:bg-blue-50 rounded text-sm font-medium text-gray-700"
                            >
                                <span className="text-xs font-bold border border-blue-500 rounded px-1 text-blue-500">?</span>
                                <span>Flashcard</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFViewer;
