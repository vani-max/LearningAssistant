import axiosInstance from "../utils/axiosInstance";

const createQuiz = async (data) => {
    const response = await axiosInstance.post('/quizzes', data);
    return response.data;
};

const getQuizzes = async (documentId) => {
    const response = await axiosInstance.get(`/quizzes?documentId=${documentId}`);
    return response.data;
};

const getQuiz = async (quizId) => {
    const response = await axiosInstance.get(`/quizzes/${quizId}`);
    return response.data;
};

const submitQuiz = async (quizId, answers) => {
    const response = await axiosInstance.post(`/quizzes/${quizId}/submit`, { answers });
    return response.data;
};

const deleteQuiz = async (quizId) => {
    const response = await axiosInstance.delete(`/quizzes/${quizId}`);
    return response.data;
};

export default {
    createQuiz,
    getQuizzes,
    getQuiz,
    submitQuiz,
    deleteQuiz
};
