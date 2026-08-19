import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService, Course } from '@/services/courseService';
import { PlayCircle, Clock, FileText, CheckCircle, ChevronDown, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export const LearnerCourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [activeLessonVideo, setActiveLessonVideo] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await courseService.getCourse(Number(id));
        setCourse(data);

        if (data.modules && data.modules.length > 0) {
          setExpandedModules({ [data.modules[0].id]: true });
        }
      } catch (error) {
        toast.error('Failed to load course details');
        navigate('/learner');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const toggleLessonVideo = (lessonId: number) => {
    setActiveLessonVideo(activeLessonVideo === lessonId ? null : lessonId);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) return null;

  const totalLessons = course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;

  return (
    <div className="w-full pb-20">
      {}
      <div className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-gray-300 mb-6 max-w-3xl">
              {course.description || 'Master the concepts and build real-world applications.'}
            </p>
          </div>
        </div>
      </div>

      {}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
          <div className="text-sm text-gray-500 mb-4 flex justify-between items-center">
            <span>{course.modules?.length || 0} modules • {totalLessons} lessons</span>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {course.modules?.map((mod, index) => {
              const isExpanded = !!expandedModules[mod.id];
              return (
                <div key={mod.id} className="border-b border-gray-200 last:border-b-0">
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 font-semibold text-gray-900">
                      <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
                      <span>Module {index + 1}: {mod.title}</span>
                    </div>
                    <span className="text-sm text-gray-500 font-normal">{mod.lessons?.length || 0} lessons</span>
                  </button>

                  {isExpanded && (
                    <div className="bg-white">
                      {mod.lessons?.map((lesson, lIndex) => {
                        const isActive = activeLessonVideo === lesson.id;
                        return (
                        <div key={lesson.id} className="flex flex-col border-t border-gray-100 first:border-t-0">
                          <div
                            className={`p-4 pl-12 flex items-start justify-between cursor-pointer hover:bg-gray-50 group transition-colors ${isActive ? 'bg-blue-50/50' : ''}`}
                            onClick={() => toggleLessonVideo(lesson.id)}
                          >
                            <div className="flex gap-3">
                              {lesson.videoUrl ? <PlayCircle className={`h-4 w-4 mt-0.5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} /> : <FileText className="h-4 w-4 mt-0.5 text-gray-400" />}
                              <div>
                                <span className={`text-sm font-medium transition-colors underline-offset-2 hover:underline ${isActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'}`}>
                                  {lIndex + 1}. {lesson.title}
                                </span>
                                {lesson.metadata && <span className="block mt-1 text-xs text-gray-400 font-mono">Includes resources</span>}
                              </div>
                            </div>
                            <Lock className="h-4 w-4 text-gray-300 hidden" />
                          </div>

                          {}
                          {isActive && (
                            <div className="px-12 py-4 bg-gray-50 border-t border-gray-100">
                              {lesson.videoUrl && (
                                <div className="mt-4 rounded-md overflow-hidden bg-black aspect-video w-full shadow-md max-w-3xl mb-4">
                                  <video src={lesson.videoUrl} controls autoPlay className="w-full h-full object-contain" />
                                </div>
                              )}
                              
                              {lesson.content && (
                                <div className="text-sm text-gray-700 whitespace-pre-wrap mb-4">
                                  {lesson.content}
                                </div>
                              )}

                              {(() => {
                                if (!lesson.metadata) return null;
                                try {
                                  const meta = JSON.parse(lesson.metadata);
                                  if (meta.type === 'document' && meta.url) {
                                    return (
                                      <div className="mt-4 p-4 border border-orange-200 bg-orange-50 rounded-lg max-w-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <FileText className="h-8 w-8 text-orange-500" />
                                          <div>
                                            <h4 className="font-semibold text-orange-900">Document Resource</h4>
                                            <p className="text-xs text-orange-700">Click to view or download this document.</p>
                                          </div>
                                        </div>
                                        <a href={meta.url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors">
                                          Open Document
                                        </a>
                                      </div>
                                    );
                                  } else if (meta.type === 'quiz' && meta.questions) {
                                    return (
                                      <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg max-w-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <CheckCircle className="h-8 w-8 text-blue-500" />
                                          <div>
                                            <h4 className="font-semibold text-blue-900">Knowledge Check Quiz</h4>
                                            <p className="text-xs text-blue-700">Click to start the interactive quiz for this lesson.</p>
                                          </div>
                                        </div>
                                        <button 
                                          onClick={() => navigate(`/learner/course/${course.id}/quiz/${lesson.id}`)} 
                                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                                        >
                                          Take Quiz
                                        </button>
                                      </div>
                                    );
                                  }
                                } catch(e) {}
                                return null;
                              })()}
                            </div>
                          )}
                        </div>
                      )})}
                      {(!mod.lessons || mod.lessons.length === 0) && (
                        <div className="p-4 pl-12 text-sm text-gray-400 italic border-t border-gray-100">
                          No lessons in this module yet.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {(!course.modules || course.modules.length === 0) && (
              <div className="p-8 text-center text-gray-500">
                This course currently has no content.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerCourseDetailsPage;
