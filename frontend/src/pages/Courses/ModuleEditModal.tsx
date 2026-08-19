import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';

interface ModuleEditModalProps {
  courseId: number;
  module: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
}

export const ModuleEditModal: React.FC<ModuleEditModalProps> = ({ courseId, module, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);

  useEffect(() => {
    if (module) {
      setTitle(module.title);
      setDescription(module.description || '');
      setOrderIndex(module.orderIndex);
    } else {
      setTitle('');
      setDescription('');
      setOrderIndex(0);
    }
  }, [module, isOpen]);

  const handleSave = () => {
    onSave({
      courseId,
      title,
      description,
      orderIndex
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={module ? 'Edit Module' : 'Add New Module'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Module Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Week 1: Introduction"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
          <input
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(Number(e.target.value))}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title}>Save Module</Button>
        </div>
      </div>
    </Modal>
  );
};
