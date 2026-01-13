import axiosInstance from "../utils/axiosInstance";

const createQuiz = async (data) => {
    const response = await axiosInstance.post(`/quizzes/create`, data);
    return response.data;
};

const getQuizzes = async (documentId) => {
    const response = await axiosInstance.get(`/quizzes/document/${documentId}`);
    return response.data;
};

const getQuiz = async (id) => {
    const response = await axiosInstance.get(`/quizzes/${id}`);
    return response.data;
};

const submitQuiz = async (id, answers) => {
    const response = await axiosInstance.post(`/quizzes/${id}/submit`, { answers });
    return response.data;
};

const deleteQuiz = async (id) => {
    const response = await axiosInstance.delete(`/quizzes/${id}`);
    return response.data;
};

const quizService = {
    createQuiz,
    getQuizzes,
    getQuiz,
    submitQuiz,
    deleteQuiz
};

export default quizService;
