import axiosInstance from "../utils/axiosInstance";

const getFlashcards = async (documentId) => {
    const response = await axiosInstance.get(`/flashcards/${documentId}`);
    return response.data;
};

const getAllFlashcardSets = async () => {
    const response = await axiosInstance.get(`/flashcards`);
    return response.data;
};

const createFlashcard = async (data) => {
    const response = await axiosInstance.post(`/flashcards/create`, data);
    return response.data;
};

const reviewFlashcard = async (cardId) => {
    const response = await axiosInstance.post(`/flashcards/${cardId}/review`);
    return response.data;
};

const deleteFlashcard = async (setId, cardId) => {
    const response = await axiosInstance.delete(`/flashcards/${setId}/cards/${cardId}`);
    return response.data;
};

const deleteFlashcardSet = async (setId) => {
    const response = await axiosInstance.delete(`/flashcards/${setId}`);
    return response.data;
};

const flashcardService = {
    getFlashcards,
    getAllFlashcardSets,
    createFlashcard,
    reviewFlashcard,
    deleteFlashcard,
    deleteFlashcardSet
};

export default flashcardService;
