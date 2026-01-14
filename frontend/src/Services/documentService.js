import axiosInstance from "../utils/axiosInstance";

const uploadDocument = async (formData) => {
    const response = await axiosInstance.post('/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
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

const addHighlight = async (id, highlightData) => {
    const response = await axiosInstance.post(`/documents/${id}/highlights`, highlightData);
    return response.data;
};

const getHighlights = async (id) => {
    const response = await axiosInstance.get(`/documents/${id}/highlights`);
    return response.data;
};

const deleteHighlight = async (docId, highlightId) => {
    const response = await axiosInstance.delete(`/documents/${docId}/highlights/${highlightId}`);
    return response.data;
};

const addNote = async (id, noteData) => {
    const response = await axiosInstance.post(`/documents/${id}/notes`, noteData);
    return response.data;
};

const getNotes = async (id) => {
    const response = await axiosInstance.get(`/documents/${id}/notes`);
    return response.data;
};

const updateNote = async (docId, noteId, content) => {
    const response = await axiosInstance.put(`/documents/${docId}/notes/${noteId}`, { content });
    return response.data;
};

const deleteNote = async (docId, noteId) => {
    const response = await axiosInstance.delete(`/documents/${docId}/notes/${noteId}`);
    return response.data;
};

const searchDocument = async (id, query) => {
    const response = await axiosInstance.get(`/documents/${id}/search?query=${encodeURIComponent(query)}`);
    return response.data;
};

export default {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument,
    addHighlight,
    getHighlights,
    deleteHighlight,
    addNote,
    getNotes,
    updateNote,
    deleteNote,
    searchDocument
};
