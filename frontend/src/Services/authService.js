import axiosInstance from "../utils/axiosInstance";

export const loginUser = async (email, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed'; // Return clean error message
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

export const getProfile = async () => {
    try {
        const response = await axiosInstance.get('/auth/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch profile';
    }
};
