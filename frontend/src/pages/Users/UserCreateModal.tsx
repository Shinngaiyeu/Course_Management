import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Department } from '@/services/departmentService';

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  departments: Department[];
}

const availableRoles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Manager' },
  { id: 3, name: 'Learner' }
];

export const UserCreateModal: React.FC<UserCreateModalProps> = ({ isOpen, onClose, onSave, departments }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [departmentId, setDepartmentId] = useState<number | ''>('');
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const toggleRole = (roleId: number) => {
    setSelectedRoles(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSave = () => {
    onSave({
      username,
      email,
      password,
      departmentId: departmentId ? Number(departmentId) : undefined,
      roleIds: selectedRoles
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New User">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="johndoe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter a secure password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : '')}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">No Department</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Roles</h4>
          <div className="space-y-2">
            {availableRoles.map(role => (
              <label key={role.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => toggleRole(role.id)}
                />
                <span className="ml-3 text-sm text-gray-700">{role.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!username || !email || !password}>Create User</Button>
        </div>
      </div>
    </Modal>
  );
};
