import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Zap, User, LogOut, BookOpen } from 'lucide-react';

const AppLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token logic here?
    // localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Flashcards', path: '/flashcards', icon: Zap },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#fcfbfc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center space-x-2 border-b border-gray-100">
          <div className="bg-primary-600 p-1.5 rounded-lg">
            <BookOpen className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">Let's Learn</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                        flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive
                  ? 'bg-primary-50 text-primary-600 font-bold shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-medium'
                }
                    `}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;