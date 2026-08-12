import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Plus, Trash2, Video, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Course, CourseModule, Lesson, courseService } from '@/services/courseService';
import { ModuleEditModal } from './ModuleEditModal';
import { LessonEditModal } from './LessonEditModal';
import toast from 'react-hot-toast';

interface CourseAccordionItemProps {
  course: Course;
  onEditCourse: (e: React.MouseEvent, course: Course) => void;
}

export const CourseAccordionItem: React.FC<CourseAccordionItemProps> = ({
  course,
  onEditCourse
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailedCourse, setDetailedCourse] = useState<Course | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [expandedQuizzes, setExpandedQuizzes] = useState<Record<number, boolean>>({});
  const [expandedVideos, setExpandedVideos] = useState<Record<number, boolean>>({});

  // Module Modal States
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);

  // Lesson Modal States
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);

  const toggleExpand = async () => {
    if (!isExpanded && !detailedCourse) {
      await fetchDetails();
    }
    setIsExpanded(!isExpanded);
  };

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const data = await courseService.getCourse(course.id);
      setDetailedCourse(data);
    } catch (err) {
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (e: React.MouseEvent, moduleId: number) => {
    e.stopPropagation();
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const toggleQuiz = (e: React.MouseEvent, lessonId: number) => {
    e.stopPropagation();
    setExpandedQuizzes(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const toggleVideo = (e: React.MouseEvent, lessonId: number) => {
    e.stopPropagation();
    setExpandedVideos(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  // --- Module Handlers ---
  const handleAddModule = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingModule(null);
    setIsModuleModalOpen(true);
  };

  const handleEditModule = (e: React.MouseEvent, mod: CourseModule) => {
    e.stopPropagation();
    setEditingModule(mod);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = async (e: React.MouseEvent, moduleId: number) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this module? All lessons inside will be deleted.')) return;
    try {
      await courseService.deleteModule(moduleId);
      toast.success('Module deleted');
      fetchDetails();
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
        await courseService.createModule(course.id, payload);
        toast.success('Module created');
      }
      setIsModuleModalOpen(false);
      fetchDetails();
    } catch (err) {
      toast.error('Failed to save module');
    }
  };

  // --- Lesson Handlers ---
  const handleAddLesson = (e: React.MouseEvent, moduleId: number) => {
    e.stopPropagation();
    setActiveModuleId(moduleId);
    setEditingLesson(null);
    setIsLessonModalOpen(true);
  };

  const handleEditLesson = (e: React.MouseEvent, lesson: Lesson, moduleId: number) => {
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
      fetchDetails();
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
      fetchDetails();
    } catch (err) {
      toast.error('Failed to save lesson');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4 shadow-sm transition-all">
      <div 
        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 border-b border-transparent"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
              <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                course.status === 1 ? 'bg-green-100 text-green-700' : 
                course.status === 2 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {course.status === 1 ? 'Published' : course.status === 2 ? 'Archived' : 'Draft'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{course.description || 'No description'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAddModule}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" /> Module
          </button>
          <button 
            onClick={(e) => onEditCourse(e, course)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-blue-600">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : detailedCourse ? (
            <div className="space-y-4">
              {detailedCourse.modules.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg bg-white">
                  No modules yet. Click "Add Module" to start.
                </div>
              ) : (
                detailedCourse.modules.map((mod) => (
                  <div key={mod.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div 
                      className="px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={(e) => toggleModule(e, mod.id)}
                    >
                      <div className="flex items-center gap-3">
                        {expandedModules[mod.id] ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                        <h4 className="font-semibold text-gray-800">
                          Module {mod.orderIndex}: {mod.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => handleAddLesson(e, mod.id)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1 flex items-center"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Lesson
                        </button>
                        <button 
                          onClick={(e) => handleEditModule(e, mod)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteModule(e, mod.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {expandedModules[mod.id] && (
                      <div className="border-t border-gray-100 bg-gray-50">
                        {mod.lessons.length === 0 ? (
                          <div className="px-5 py-4 text-sm text-gray-500 text-center italic">
                            No lessons in this module.
                          </div>
                        ) : (
                          <ul className="divide-y divide-gray-100">
                            {mod.lessons.map((lesson, index) => (
                              <li key={lesson.id} className="px-5 py-3 flex items-start justify-between hover:bg-white transition-colors group">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className="mt-0.5">
                                    {lesson.videoUrl ? <Video className="h-4 w-4 text-blue-500" /> : <FileText className="h-4 w-4 text-gray-400" />}
                                  </div>
                                  <div className="flex flex-col flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-gray-800">{index + 1}. {lesson.title}</span>
                                    </div>
                                    {lesson.content && (
                                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 pr-4">{lesson.content}</p>
                                    )}
                                    
                                    {/* Parse and render rich content */}
                                    {(() => {
                                      let parsedMeta: any = {};
                                      try { if (lesson.metadata) parsedMeta = JSON.parse(lesson.metadata); } catch (e) {}
                                      
                                      const isQuiz = parsedMeta.type === 'quiz';
                                      const isDocument = parsedMeta.type === 'document';
                                      const isVideo = !!lesson.videoUrl;

                                      return (
                                        <>
                                          {isVideo && (
                                            <div className="mt-3 flex flex-col gap-2">
                                              <button 
                                                onClick={(e) => toggleVideo(e, lesson.id)}
                                                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md border border-blue-100 w-max shadow-sm cursor-pointer transition-colors"
                                              >
                                                <Video className="h-3.5 w-3.5" />
                                                Video Preview
                                                {expandedVideos[lesson.id] ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                                              </button>
                                              
                                              {expandedVideos[lesson.id] && (
                                                <div className="relative w-72 max-w-full rounded-md overflow-hidden bg-black aspect-video border border-gray-200 shadow-sm">
                                                  <video src={lesson.videoUrl} controls className="w-full h-full object-contain" />
                                                </div>
                                              )}
                                            </div>
                                          )}
                                          
                                          {isDocument && (
                                            <a href={parsedMeta.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-md transition-colors border border-orange-100 w-max shadow-sm">
                                              <FileText className="h-3.5 w-3.5" />
                                              View Document (PDF)
                                            </a>
                                          )}

                                          {isQuiz && (
                                            <div className="mt-3 flex flex-col gap-2">
                                              <button 
                                                onClick={(e) => toggleQuiz(e, lesson.id)}
                                                className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-md border border-purple-100 w-max shadow-sm cursor-pointer transition-colors"
                                              >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Interactive Quiz ({parsedMeta.questions?.length || 1} Questions)
                                                {expandedQuizzes[lesson.id] ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                                              </button>
                                              
                                              {expandedQuizzes[lesson.id] && parsedMeta.questions && (
                                                <div className="mt-2 mb-2 pl-4 border-l-2 border-purple-200 space-y-3">
                                                  {parsedMeta.questions.map((q: any, qIdx: number) => (
                                                    <div key={qIdx} className="bg-white border border-gray-100 rounded-lg p-3 text-sm shadow-sm">
                                                      <p className="font-semibold text-gray-800 mb-2">Q{qIdx + 1}: {q.question}</p>
                                                      <ul className="space-y-1.5">
                                                        {q.options?.map((opt: string, oIdx: number) => (
                                                          <li key={oIdx} className={`flex items-center text-xs px-2.5 py-1.5 rounded-md ${q.correctAnswer === oIdx ? 'bg-green-50 text-green-700 font-medium border border-green-100' : 'text-gray-600 bg-gray-50'}`}>
                                                            {q.correctAnswer === oIdx ? <CheckCircle className="h-3.5 w-3.5 mr-2" /> : <div className="h-3.5 w-3.5 mr-2 border border-gray-300 rounded-full"></div>}
                                                            {opt}
                                                          </li>
                                                        ))}
                                                      </ul>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                                <div className="hidden group-hover:flex items-center gap-1">
                                  <button 
                                    onClick={(e) => handleEditLesson(e, lesson, mod.id)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md transition-colors"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button 
                                    onClick={(e) => handleDeleteLesson(e, lesson.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-md transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
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
          ) : null}
        </div>
      )}

      {/* Embedded Modals for this specific Course */}
      <ModuleEditModal 
        courseId={course.id}
        module={editingModule}
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        onSave={handleSaveModule}
      />

      {activeModuleId && (
        <LessonEditModal
          moduleId={activeModuleId}
          lesson={editingLesson}
          isOpen={isLessonModalOpen}
          onClose={() => setIsLessonModalOpen(false)}
          onSave={handleSaveLesson}
        />
      )}
    </div>
  );
};
