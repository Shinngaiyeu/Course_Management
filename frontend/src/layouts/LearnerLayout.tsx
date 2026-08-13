import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { BookOpen, UserCircle, LogOut, Search } from 'lucide-react';
import { authService } from '../services/authService';

export const LearnerLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/learner')}>
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 tracking-tight">LMS <span className="text-blue-600 font-light">Learner</span></span>
            </div>

            <div className="flex-1 max-w-2xl px-8 hidden md:flex items-center">
              <div className="w-full relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                  placeholder="Search for anything..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <span className="text-sm font-medium text-gray-600 hover:text-blue-600 cursor-pointer hidden sm:block">My Learning</span>

              <div className="relative group">
                <button className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
                  <UserCircle className="h-8 w-8" />
                </button>
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {}
      <main className="flex-1 w-full bg-gray-50">
        <Outlet />
      </main>

      {}
      <footer className="bg-white border-t border-gray-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} LMS Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
