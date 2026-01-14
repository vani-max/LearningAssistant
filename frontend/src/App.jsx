import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage.jsx';
import NotFoundPage from './pages/notFoundPage.jsx';
import DocumentDetailsPage from './pages/Documents/DocumentDetailsPage.jsx';
import FlashcardsPage from './pages/FlashCards/FlashcardsPage.jsx';
import QuizresultPage from './pages/Quizzes/QuizresultPage.jsx';
import DashboardPage from './pages/Dashboard/DashboardPage.jsx';
import DocumentListPage from './pages/Documents/DocumentListPage.jsx';
import FlashcardListPage from './pages/FlashCards/FlashcardListPage.jsx';
import QuiztakePage from './pages/Quizzes/QuiztakePage.jsx';
import QuizListPage from './pages/Quizzes/QuizListPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import './App.css';

const App = () => {
    const token = localStorage.getItem('token');
    const isAppAuthenticated = !!token;
    const loading = false;

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={
                    isAppAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/documents" element={<DocumentListPage />} />
                    <Route path="/documents/:id" element={<DocumentDetailsPage />} />
                    <Route path="/flashcards" element={<FlashcardListPage />} />
                    <Route path="/documents/:id/flashcards" element={<FlashcardsPage />} />
                    <Route path="/documents/:id/quizzes" element={<QuizListPage />} />
                    <Route path="/quizzes/:quizId" element={<QuiztakePage />} />
                    <Route path="/quizzes/:quizId/results" element={<QuizresultPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>

                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
}
export default App;
