import axiosInstance from "../utils/axiosInstance";

const getAllFlashcardSets = async () => {
    const response = await axiosInstance.get('/flashcards');
    return response.data;
};

const getFlashcards = async (documentId) => {
    const response = await axiosInstance.get(`/flashcards/${documentId}`);
    return response.data;
};

const createFlashcard = async (data) => {
    const response = await axiosInstance.post('/flashcards', data);
    return response.data;
};

const reviewFlashcard = async (cardId, rating) => {
    const response = await axiosInstance.post(`/flashcards/${cardId}/review`, { rating });
    return response.data;
};

const deleteFlashcard = async (documentId, cardId) => {
    const response = await axiosInstance.delete(`/flashcards/${documentId}/cards/${cardId}`);
    return response.data;
};

const deleteFlashcardSet = async (setId) => {
    const response = await axiosInstance.delete(`/flashcards/${setId}`);
    return response.data;
};

export default {
    getAllFlashcardSets,
    getFlashcards,
    createFlashcard,
    reviewFlashcard,
    deleteFlashcard,
    deleteFlashcardSet
};
