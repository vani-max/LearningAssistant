import axiosInstance from "../utils/axiosInstance";

export const loginUser = async (email, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed';
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration failed';
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};
