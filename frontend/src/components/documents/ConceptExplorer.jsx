import React, { useState } from 'react';
import { Search, Loader2, ChevronRight } from 'lucide-react';
import documentService from '../../Services/documentService';

const ConceptExplorer = ({ documentId }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const data = await documentService.searchDocument(documentId, query);
            setResults(data.results || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-800 mb-2">Concept Explorer</h3>
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search concepts..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-primary-500" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {results.map((result, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg hover:bg-primary-50 transition cursor-pointer group border border-transparent hover:border-primary-100">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-primary-600 bg-primary-100 px-2 py-0.5 rounded">
                                        Page {result.page}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 line-clamp-3">
                                    "...{result.text}..."
                                </p>
                            </div>
                        ))}
                        {results.length === 0 && query && !loading && (
                            <p className="text-center text-gray-500 text-sm">No results found.</p>
                        )}
                        {!query && (
                            <div className="text-center text-gray-400 text-sm mt-4">
                                Search for keywords to find relevant sections.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConceptExplorer;
