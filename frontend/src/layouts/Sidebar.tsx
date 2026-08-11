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
    <div className="flex flex-col w-64 bg-white h-screen border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold tracking-wider text-blue-600">LMS Admin</h1>
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
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-sm text-blue-700">
              AD
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
              className="text-xs font-medium text-red-600 cursor-pointer hover:text-red-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
