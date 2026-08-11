import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Department } from '@/services/departmentService';

interface DepartmentEditModalProps {
  department: Department | null; // null means create mode
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: Omit<Department, 'id'>) => void;
}

export const DepartmentEditModal: React.FC<DepartmentEditModalProps> = ({ department, isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (department) {
      setName(department.name);
      setDescription(department.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [department, isOpen]);

  const handleSave = () => {
    onSave({
      name,
      description
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={department ? `Edit Department: ${department.name}` : 'Create New Department'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Engineering"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Optional description"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name}>Save Department</Button>
        </div>
      </div>
    </Modal>
  );
};
