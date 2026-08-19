import React, { useState, useEffect } from 'react';
import { Department, departmentService } from '../../services/departmentService';
import { Edit2, Plus, LayoutDashboard } from 'lucide-react';
import { DepartmentEditModal } from './DepartmentEditModal';
import toast from 'react-hot-toast';

const DepartmentManagementPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (payload: Omit<Department, 'id'>) => {
    try {
      if (editingDept) {
        await departmentService.updateDepartment(editingDept.id, payload);
        toast.success('Department updated successfully');
      } else {
        await departmentService.createDepartment(payload);
        toast.success('Department created successfully');
      }
      fetchDepartments();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save department', error);
      toast.error('Failed to save department');
    }
  };

  const openCreateModal = () => {
    setEditingDept(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center">
            <LayoutDashboard className="mr-3 h-8 w-8 text-blue-600" />
            Departments
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your organization's departments and their descriptions.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading departments...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{dept.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(dept)}
                      className="text-blue-600 hover:text-blue-900 flex items-center justify-end w-full"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {departments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No departments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <DepartmentEditModal
        department={editingDept}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default DepartmentManagementPage;
