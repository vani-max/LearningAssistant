import axiosInstance from "../utils/axiosInstance";

const uploadDocument = async (formData) => {
    const response = await axiosInstance.post('/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

const getDocuments = async () => {
    const response = await axiosInstance.get('/documents');
    return response.data;
};

const getDocument = async (id) => {
    const response = await axiosInstance.get(`/documents/${id}`);
    return response.data;
};

const deleteDocument = async (id) => {
    const response = await axiosInstance.delete(`/documents/${id}`);
    return response.data;
};

const addHighlight = async (docId, highlightData) => {
    const response = await axiosInstance.post(`/documents/${docId}/highlights`, highlightData);
    return response.data;
};

const getHighlights = async (docId) => {
    const response = await axiosInstance.get(`/documents/${docId}/highlights`);
    return response.data;
};

const deleteHighlight = async (docId, highlightId) => {
    const response = await axiosInstance.delete(`/documents/${docId}/highlights/${highlightId}`);
    return response.data;
};

const addNote = async (docId, noteData) => {
    const response = await axiosInstance.post(`/documents/${docId}/notes`, noteData);
    return response.data;
};

const getNotes = async (docId) => {
    const response = await axiosInstance.get(`/documents/${docId}/notes`);
    return response.data;
};

const deleteNote = async (docId, noteId) => {
    const response = await axiosInstance.delete(`/documents/${docId}/notes/${noteId}`);
    return response.data;
};

const updateNote = async (docId, noteId, content) => {
    const response = await axiosInstance.put(`/documents/${docId}/notes/${noteId}`, { content });
    return response.data;
};

const searchDocument = async (id, query) => {
    const response = await axiosInstance.get(`/documents/${id}/search`, { params: { query } });
    return response.data;
};

const documentService = {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument,
    addHighlight,
    getHighlights,
    deleteHighlight,
    addNote,
    getNotes,
    deleteNote,
    deleteNote,
    updateNote,
    searchDocument
};

export default documentService;
