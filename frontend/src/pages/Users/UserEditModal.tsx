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

const availableRoles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Manager' },
  { id: 3, name: 'Learner' }
];

export const UserEditModal: React.FC<UserEditModalProps> = ({ user, departments, isOpen, onClose, onSave }) => {
  const [selectedRoles, setSelectedRoles] = useState<number[]>(user.roleIds || []);
  const [departmentId, setDepartmentId] = useState<number | undefined>(user.departmentId);

  const handleSave = () => {
    onSave({
      ...user,
      roleIds: selectedRoles,
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={selectedRoles.length > 0 ? String(selectedRoles[0]) : ''}
            onChange={(e) => setSelectedRoles(e.target.value ? [Number(e.target.value)] : [])}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a role</option>
            {availableRoles.map(role => (
              <option key={role.id} value={String(role.id)}>{role.name}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
};
