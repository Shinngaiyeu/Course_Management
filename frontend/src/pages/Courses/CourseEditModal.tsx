import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Course, courseService } from '@/services/courseService';
import { Wand2, Loader2, EyeOff, Eye, Archive, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 0, label: 'Draft', subtext: 'Hidden', icon: EyeOff, iconColor: 'text-gray-500', bgColor: 'bg-gray-50', hoverBg: 'hover:bg-gray-50' },
  { value: 1, label: 'Published', subtext: 'Visible', icon: Eye, iconColor: 'text-green-600', bgColor: 'bg-green-50', hoverBg: 'hover:bg-green-50' },
  { value: 2, label: 'Archived', subtext: 'Read-only', icon: Archive, iconColor: 'text-red-600', bgColor: 'bg-red-50', hoverBg: 'hover:bg-red-50' },
];
import toast from 'react-hot-toast';

interface CourseEditModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
}

export const CourseEditModal: React.FC<CourseEditModalProps> = ({ course, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<0 | 1 | 2>(0);

  const [rawContent, setRawContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description || '');
      setStatus(course.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus(0);
    }
    setRawContent('');
  }, [course, isOpen]);

  const handleAiSuggest = async () => {
    if (!rawContent.trim()) {
      toast.error('Please enter some raw content first.');
      return;
    }
    try {
      setIsGenerating(true);
      const res = await courseService.suggestContent(rawContent);
      setTitle(res.suggestedTitle);
      setDescription(res.suggestedDescription);
      toast.success('AI successfully generated course content!');
    } catch (err) {
      toast.error('Failed to get AI suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    onSave({
      title,
      description,
      status
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={course ? `Edit Course: ${course.title}` : 'Create New Course'}>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Course Title</label>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Introduction to React"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Course description..."
          />
        </div>

        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          <label className="block text-sm font-medium text-blue-900 mb-2 flex items-center">
            <Wand2 className="h-4 w-4 mr-1 text-blue-600" />
            AI Content Assistant
          </label>
          <textarea
            value={rawContent}
            onChange={(e) => setRawContent(e.target.value)}
            rows={2}
            className="block w-full border border-blue-200 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 mb-2 bg-white"
            placeholder="Paste raw notes, syllabus, or ideas here, and let AI generate the Title and Description..."
          />
          <button
            type="button"
            onClick={handleAiSuggest}
            disabled={isGenerating || !rawContent}
            className="text-sm bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded flex items-center hover:bg-blue-50 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Wand2 className="h-3 w-3 mr-1" />}
            {isGenerating ? 'Generating...' : 'Auto-Generate'}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between shadow-sm transition-colors hover:border-gray-400"
            >
              <div className="flex items-center gap-2">
                {(() => {
                  const opt = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];
                  const Icon = opt.icon;
                  return (
                    <>
                      <Icon className={`h-4 w-4 ${opt.iconColor}`} />
                      <span className="font-medium text-gray-900">{opt.label}</span>
                      <span className="text-gray-500">- {opt.subtext}</span>
                    </>
                  );
                })()}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1 overflow-hidden">
                {STATUS_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setStatus(opt.value as 0 | 1 | 2);
                        setIsStatusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 flex items-center gap-2 transition-colors ${opt.hoverBg} ${status === opt.value ? opt.bgColor : ''}`}
                    >
                      <Icon className={`h-4 w-4 ${opt.iconColor}`} />
                      <span className={`font-medium ${status === opt.value ? 'text-gray-900' : 'text-gray-700'}`}>{opt.label}</span>
                      <span className="text-gray-500 text-xs">- {opt.subtext}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title}>Save Course</Button>
        </div>
      </div>
    </Modal>
  );
};
