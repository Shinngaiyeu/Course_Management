import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, LayoutDashboard, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'User Management', path: '/users', icon: Users },
    { name: 'Departments', path: '/departments', icon: LayoutDashboard },
    { name: 'Sync Logs', path: '/sync-logs', icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-900 h-screen text-white">
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-wider text-blue-400">LMS Admin</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">
              AD
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
              className="text-xs font-medium text-red-400 cursor-pointer hover:text-red-300"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
