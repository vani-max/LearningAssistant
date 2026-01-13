import React, { useState } from 'react';
import { Search, BookOpen, X, Loader2 } from 'lucide-react';

const ConceptExplorer = ({ onSearch, onNavigate, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setHasSearched(true);
        try {
            const res = await onSearch(query);
            setResults(res.results || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-80 md:w-96 bg-white border-l border-gray-200 h-full flex flex-col shadow-xl z-20 absolute right-0 top-0 bottom-0">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="font-bold text-gray-700 flex items-center">
                    <BookOpen size={18} className="mr-2 text-primary-600" />
                    Concept Explorer
                </h2>
                <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded text-gray-500">
                    <X size={18} />
                </button>
            </div>

            <div className="p-4 border-b border-gray-200">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search concepts..."
                        className="w-full pl-9 pr-3 py-2 bg-gray-100 border border-transparent focus:bg-white focus:border-primary-500 rounded-lg outline-none text-sm transition-all"
                    />
                    <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-primary-500" />
                    </div>
                ) : results.length > 0 ? (
                    results.map((result, idx) => (
                        <div
                            key={idx}
                            onClick={() => onNavigate(result.pageNumber)}
                            className="p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50 cursor-pointer transition group"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-500 uppercase">Page {result.pageNumber}</span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{result.matchCount} matches</span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed font-serif" dangerouslySetInnerHTML={{
                                __html: result.snippet.replace(new RegExp(`(${query})`, 'gi'), '<mark class="bg-yellow-200 text-gray-900 rounded-sm px-0.5">$1</mark>')
                            }} />
                        </div>
                    ))
                ) : hasSearched ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No results found for "{query}"</p>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <Search size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Search for keywords to explore concepts in this document.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConceptExplorer;
