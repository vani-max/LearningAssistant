import React from 'react';
import { User, Mail, Shield } from 'lucide-react';

const ProfilePage = () => {

  const user = {
    name: "Vani",
    email: "vani@gmail.com",
    role: "Student"
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-400 to-primary-600"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-full p-2 inline-block shadow-md">
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <User size={40} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <div className="text-lg font-bold text-gray-800 flex items-center">
                <User size={18} className="mr-2 text-gray-400" />
                {user.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <div className="text-lg font-bold text-gray-800 flex items-center">
                <Mail size={18} className="mr-2 text-gray-400" />
                {user.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <Shield size={14} className="mr-2" />
                {user.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;