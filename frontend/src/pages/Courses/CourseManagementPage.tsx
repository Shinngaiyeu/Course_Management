import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Search, Edit2 } from 'lucide-react';
import { courseService, Course, PagedResult } from '@/services/courseService';
import { authService } from '@/services/authService';
import { CourseEditModal } from './CourseEditModal';
import { CourseAccordionItem } from './CourseAccordionItem';
import toast from 'react-hot-toast';

export const CourseManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [pagedData, setPagedData] = useState<PagedResult<Course>>({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const isManager = authService.getRoles().includes('Manager');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, debouncedSearch]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses(currentPage, 10, debouncedSearch);
      setPagedData(data);
    } catch (error) {
      console.error('Failed to fetch courses', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (payload: any) => {
    try {
      if (editingCourse) {
        await courseService.updateCourse(editingCourse.id, payload);
        toast.success('Course updated successfully');
      } else {
        await courseService.createCourse(payload);
        toast.success('Course created successfully');
      }
      fetchCourses();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save course', error);
      toast.error('Failed to save course');
    }
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation(); // Prevent row click
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center">
            <BookOpen className="mr-3 h-8 w-8 text-blue-600" />
            Courses
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage courses, modules, and lessons.
          </p>
        </div>
        {isManager && (
          <button 
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center shadow-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex mb-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {pagedData.items.map((course) => (
              <CourseAccordionItem 
                key={course.id} 
                course={course} 
                onEditCourse={openEditModal} 
              />
            ))}
            
            {pagedData.items.length === 0 && (
              <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-lg font-medium">No courses found</p>
                <p className="text-sm mt-1">Create your first course to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <CourseEditModal
        course={editingCourse}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default CourseManagementPage;
