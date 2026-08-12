import React, { useState, useEffect } from 'react';
import { UserTable } from './UserTable';
import { UserEditModal } from './UserEditModal';
import { UserCreateModal } from './UserCreateModal';
import { userService, User, PagedResult } from '@/services/userService';
import { departmentService, Department } from '@/services/departmentService';
import { Users as UsersIcon, Search, Filter, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

export const UserManagementPage: React.FC = () => {
  const [pagedData, setPagedData] = useState<PagedResult<User>>({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [lockUser, setLockUser] = useState<User | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Load Departments once
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const depts = await departmentService.getDepartments();
        setDepartments(depts);
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }
    };
    fetchDepts();
  }, []);

  // Fetch Users based on dependencies
  useEffect(() => {
    fetchUsers();
  }, [currentPage, selectedDeptId, debouncedSearch]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers(currentPage, 10, selectedDeptId, debouncedSearch);
      setPagedData(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleToggleLock = (user: User) => {
    setLockUser(user);
  };

  const handleConfirmLock = async () => {
    if (!lockUser) return;
    try {
      const updatedStatus = lockUser.status === 'Active' ? 'Locked' : 'Active';
      await userService.updateUser({ ...lockUser, status: updatedStatus });
      toast.success(`Account successfully ${updatedStatus.toLowerCase()}`);
      fetchUsers(); // Refresh current page
      setLockUser(null);
    } catch (error) {
      console.error('Failed to update user status', error);
      toast.error('Failed to update user status');
    }
  };

  const handleSave = async (updatedUser: User) => {
    try {
      await userService.updateUser(updatedUser);
      toast.success('User updated successfully');
      fetchUsers(); // Refresh current page
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update user', error);
      toast.error('Failed to update user');
    }
  };

  const handleCreate = async (payload: any) => {
    try {
      await userService.createUser(payload);
      toast.success('User created successfully');
      fetchUsers(); // Refresh current page
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Failed to create user', error);
      toast.error('Failed to create user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center">
            <UsersIcon className="mr-3 h-8 w-8 text-blue-600" />
            User Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your users, their roles, and account status from HRIS sync.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="flex items-center">
          Add User
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedDeptId || ''}
              onChange={(e) => {
                setSelectedDeptId(e.target.value ? Number(e.target.value) : undefined);
                setCurrentPage(1); // Reset to page 1 on filter change
              }}
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <UserTable users={pagedData.items} onEdit={handleEdit} onToggleLock={handleToggleLock} />
            
            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagedData.pageNumber - 1) * pagedData.pageSize + 1}</span> to <span className="font-medium">{Math.min(pagedData.pageNumber * pagedData.pageSize, pagedData.totalCount)}</span> of{' '}
                    <span className="font-medium">{pagedData.totalCount}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      Page {pagedData.pageNumber} of {Math.max(1, pagedData.totalPages)}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(pagedData.totalPages, p + 1))}
                      disabled={currentPage >= pagedData.totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {isCreateOpen && (
        <UserCreateModal
          isOpen={true}
          onClose={() => setIsCreateOpen(false)}
          onSave={handleCreate}
          departments={departments}
        />
      )}

      {editingUser && (
        <UserEditModal
          user={editingUser}
          departments={departments}
          isOpen={true}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}

      {lockUser && (
        <Modal 
          isOpen={true} 
          onClose={() => setLockUser(null)} 
          title={lockUser.status === 'Active' ? 'Lock Account' : 'Unlock Account'}
        >
          <div className="flex flex-col items-center p-4">
            <AlertTriangle className={`h-12 w-12 mb-4 ${lockUser.status === 'Active' ? 'text-red-500' : 'text-green-500'}`} />
            <p className="text-center text-gray-700 font-medium text-lg mb-2">
              Are you sure you want to {lockUser.status === 'Active' ? 'lock' : 'unlock'} this account?
            </p>
            <p className="text-center text-gray-500 text-sm mb-6">
              User: <span className="font-semibold text-gray-900">{lockUser.email}</span>
            </p>
            <div className="flex gap-4 w-full">
              <Button variant="secondary" className="flex-1" onClick={() => setLockUser(null)}>
                Cancel
              </Button>
              <button 
                className={`flex-1 rounded-md px-4 py-2 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${lockUser.status === 'Active' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'}`}
                onClick={handleConfirmLock}
              >
                Yes, {lockUser.status === 'Active' ? 'Lock' : 'Unlock'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManagementPage;
