import React, { useEffect, useState } from 'react';
import { User, Mail } from 'lucide-react';
import { getProfile } from '../../Services/authService';

const ProfilePage = () => {
    const [user, setUser] = useState({
        username: 'User',
        email: 'user@example.com',
        role: 'Student'
    }); // Mock initial state or fetch from endpoint if available

    // Fetch real profile if endpoint exists
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                if (data.user) {
                    setUser(prev => ({ ...prev, ...data.user }));
                }
            } catch (e) {
                console.log(e);
            }
        }
        fetchProfile();
    }, []);

    return (
        <div className="p-8 h-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

            <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-primary-50 p-8 flex items-center space-x-6">
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-4xl font-bold">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
                        <span className="inline-block mt-2 px-3 py-1 bg-white text-primary-600 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                            {user.role}
                        </span>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center space-x-3 mb-2 text-gray-500">
                                <User size={18} />
                                <span className="text-sm font-medium">Full Name</span>
                            </div>
                            <p className="font-semibold text-gray-800 text-lg">{user.username}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center space-x-3 mb-2 text-gray-500">
                                <Mail size={18} />
                                <span className="text-sm font-medium">Email Address</span>
                            </div>
                            <p className="font-semibold text-gray-800 text-lg">{user.email}</p>
                        </div>
                        {/* 
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-3 mb-2 text-gray-500">
                        <BookOpen size={18} />
                        <span className="text-sm font-medium">Total Study Time</span>
                    </div>
                    <p className="font-semibold text-gray-800 text-lg">12h 30m</p>
                </div>
                 */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
