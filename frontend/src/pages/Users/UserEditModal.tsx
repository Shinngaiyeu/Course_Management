import React, { useState } from 'react';
import { User, Role } from '@/services/userService';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';

interface UserEditModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
}

const availableRoles: Role[] = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Manager' },
  { id: 3, name: 'Learner' },
];

export const UserEditModal: React.FC<UserEditModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [isActive, setIsActive] = useState(user.isActive);
  const [selectedRoles, setSelectedRoles] = useState<number[]>(
    user.userRoles.map(ur => ur.roleId)
  );

  const toggleRole = (roleId: number) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSave = () => {
    const updatedUserRoles = selectedRoles.map(id => ({
      roleId: id,
      role: availableRoles.find(r => r.id === id)!
    }));

    onSave({
      ...user,
      isActive,
      userRoles: updatedUserRoles
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit User: ${user.username}`}>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Account Status</h4>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isActive} 
                onChange={() => setIsActive(!isActive)} 
              />
              <div className={`block w-14 h-8 rounded-full transition-colors ${isActive ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isActive ? 'transform translate-x-6' : ''}`}></div>
            </div>
            <div className="ml-3 text-sm font-medium text-gray-700">
              {isActive ? 'Active (Can login)' : 'Locked (Cannot login)'}
            </div>
          </label>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Roles</h4>
          <div className="space-y-3">
            {availableRoles.map(role => (
              <label key={role.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
};
