import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ChevronDown, ChevronUp, FileText, Video, Edit2, Trash2 } from 'lucide-react';
import { courseService, Course, CourseModule, Lesson } from '@/services/courseService';
import { ModuleEditModal } from './ModuleEditModal';
import { LessonEditModal } from './LessonEditModal';
import toast from 'react-hot-toast';

export const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

  // Modal states
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await courseService.getCourse(Number(id));
        setCourse(data);

        // Expand first module by default if it exists
        if (data.modules && data.modules.length > 0) {
          setExpandedModules({ [data.modules[0].id]: true });
        }
      }
    } catch (error) {
      console.error('Failed to fetch course', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Module Handlers
  const openCreateModule = () => {
    setEditingModule(null);
    setIsModuleModalOpen(true);
  };

  const openEditModule = (e: React.MouseEvent, mod: CourseModule) => {
    e.stopPropagation();
    setEditingModule(mod);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = async (e: React.MouseEvent, modId: number) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this module? All lessons inside will be deleted.')) return;
    try {
      await courseService.deleteModule(modId);
      toast.success('Module deleted');
      fetchCourse();
    } catch (err) {
      toast.error('Failed to delete module');
    }
  };

  const handleSaveModule = async (payload: any) => {
    try {
      if (editingModule) {
        await courseService.updateModule(editingModule.id, payload);
        toast.success('Module updated');
      } else {
        await courseService.createModule(Number(id), payload);
        toast.success('Module created');
      }
      setIsModuleModalOpen(false);
      fetchCourse();
    } catch (err) {
      toast.error('Failed to save module');
    }
  };

  // Lesson Handlers
  const openCreateLesson = (e: React.MouseEvent, moduleId: number) => {
    e.stopPropagation();
    setActiveModuleId(moduleId);
    setEditingLesson(null);
    setIsLessonModalOpen(true);
  };

  const openEditLesson = (e: React.MouseEvent, lesson: Lesson, moduleId: number) => {
    e.stopPropagation();
    setActiveModuleId(moduleId);
    setEditingLesson(lesson);
    setIsLessonModalOpen(true);
  };

  const handleDeleteLesson = async (e: React.MouseEvent, lessonId: number) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await courseService.deleteLesson(lessonId);
      toast.success('Lesson deleted');
      fetchCourse();
    } catch (err) {
      toast.error('Failed to delete lesson');
    }
  };

  const handleSaveLesson = async (payload: any) => {
    try {
      if (editingLesson) {
        await courseService.updateLesson(editingLesson.id, payload);
        toast.success('Lesson updated');
      } else {
        await courseService.createLesson(payload.courseModuleId, payload);
        toast.success('Lesson created');
      }
      setIsLessonModalOpen(false);
      fetchCourse();
    } catch (err) {
      toast.error('Failed to save lesson');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  if (!course) {
    return <div className="p-10 text-center text-red-500">Course not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/courses')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {course.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {course.status === 1 ? 'Published' : course.status === 2 ? 'Archived' : 'Draft'} • {new Date(course.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={openCreateModule}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center shadow-sm font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">About this Course</h3>
        <p className="text-gray-700">{course.description || 'No description provided.'}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Curriculum</h3>

        {course.modules.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-gray-200 text-center border-dashed">
            <p className="text-gray-500 mb-4">No modules yet. Start building your curriculum.</p>
            <button onClick={openCreateModule} className="text-blue-600 font-medium hover:underline">
              Add your first module
            </button>
          </div>
        ) : (
          course.modules.map(mod => (
            <div key={mod.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div
                className="px-4 py-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleModule(mod.id)}
              >
                <div className="flex items-center gap-3">
                  {expandedModules[mod.id] ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                  <h4 className="text-md font-semibold text-gray-900">Module {mod.orderIndex}: {mod.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => openCreateLesson(e, mod.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 flex items-center">
                    <Plus className="h-4 w-4 mr-1" /> Lesson
                  </button>
                  <button onClick={(e) => openEditModule(e, mod)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={(e) => handleDeleteModule(e, mod.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {expandedModules[mod.id] && (
                <div className="border-t border-gray-200">
                  {mod.lessons.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500 text-center">No lessons in this module.</div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {mod.lessons.map((lesson, index) => (
                        <li key={lesson.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 group">
                          <div className="flex items-center gap-3">
                            {lesson.videoUrl ? <Video className="h-4 w-4 text-blue-500" /> : <FileText className="h-4 w-4 text-gray-400" />}
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-700">{index + 1}. {lesson.title}</span>
                              {lesson.metadata && <span className="text-xs text-gray-400 mt-0.5">Metadata: {lesson.metadata}</span>}
                            </div>
                          </div>
                          <div className="hidden group-hover:flex items-center gap-2">
                            <button onClick={(e) => openEditLesson(e, lesson, mod.id)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={(e) => handleDeleteLesson(e, lesson.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <ModuleEditModal
        courseId={Number(id)}
        module={editingModule}
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        onSave={handleSaveModule}
      />

      <LessonEditModal
        moduleId={activeModuleId!}
        lesson={editingLesson}
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onSave={handleSaveLesson}
      />
    </div>
  );
};

export default CourseDetailsPage;
