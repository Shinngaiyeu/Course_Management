import React, { useState } from 'react';
import { User } from '@/services/userService';
import { Department } from '@/services/departmentService';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';

interface UserEditModalProps {
  user: User;
  departments: Department[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
}

const availableRoles = ['Admin', 'Manager', 'Learner'];

export const UserEditModal: React.FC<UserEditModalProps> = ({ user, departments, isOpen, onClose, onSave }) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles || []);
  const [departmentId, setDepartmentId] = useState<number | undefined>(user.departmentId);

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSave = () => {
    onSave({
      ...user,
      roles: selectedRoles,
      departmentId
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit User: ${user.username}`}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            value={departmentId || ''}
            onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">No Department</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Roles</h4>
          <div className="space-y-3">
            {availableRoles.map(role => (
              <label key={role} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={selectedRoles.includes(role)}
                  onChange={() => toggleRole(role)}
                />
                <span className="ml-3 text-sm text-gray-700">{role}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
};
