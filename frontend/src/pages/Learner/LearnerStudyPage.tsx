import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService, Course } from '@/services/courseService';
import { PlayCircle, FileText, CheckCircle, ChevronDown, ChevronRight, Menu, ArrowLeft, Loader2, List } from 'lucide-react';
import toast from 'react-hot-toast';

export const LearnerStudyPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string, lessonId?: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  
  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!courseId) return;
        setLoading(true);
        const data = await courseService.getCourse(Number(courseId));
        setCourse(data);

        // Auto-expand module that contains the active lesson, or first module
        let targetModuleId = data.modules?.[0]?.id;
        
        if (lessonId && data.modules) {
          for (const mod of data.modules) {
            if (mod.lessons?.some((l: any) => l.id === Number(lessonId))) {
              targetModuleId = mod.id;
              break;
            }
          }
        }
        
        if (targetModuleId) {
          setExpandedModules({ [targetModuleId]: true });
        }
      } catch (error) {
        toast.error('Failed to load course details');
        navigate('/learner');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, navigate, lessonId]);

  // Reset quiz state when lesson changes
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  }, [lessonId]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
      </div>
    );
  }

  if (!course) return null;

  // Flatten lessons for next/prev navigation
  const allLessons: any[] = [];
  course.modules?.forEach(m => {
    if (m.lessons) {
      allLessons.push(...m.lessons);
    }
  });

  const activeLessonIndex = allLessons.findIndex(l => l.id === Number(lessonId));
  const activeLesson = activeLessonIndex >= 0 ? allLessons[activeLessonIndex] : allLessons[0];
  const activeModule = course.modules?.find(m => m.lessons?.some(l => l.id === activeLesson?.id));
  
  const prevLesson = activeLessonIndex > 0 ? allLessons[activeLessonIndex - 1] : null;
  const nextLesson = activeLessonIndex >= 0 && activeLessonIndex < allLessons.length - 1 ? allLessons[activeLessonIndex + 1] : null;

  // Metadata Parsing for Document and Quiz
  let parsedMeta = null;
  if (activeLesson?.metadata) {
    try { parsedMeta = JSON.parse(activeLesson.metadata); } catch(e) {}
  }

  const getLessonIcon = (lesson: any) => {
    let meta = null;
    if (lesson.metadata) {
      try { meta = JSON.parse(lesson.metadata); } catch(e) {}
    }
    if (meta?.type === 'quiz') return <CheckCircle className="h-4 w-4" />;
    if (meta?.type === 'document') return <FileText className="h-4 w-4" />;
    if (lesson.videoUrl) return <PlayCircle className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <div className={`flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-0 hidden md:flex md:w-16 md:items-center'}`}>
        
        {/* Sidebar Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-white text-gray-900 shrink-0 shadow-sm">
          {sidebarOpen ? (
            <Link to={`/learner/course/${course.id}`} className="flex items-center text-sm font-bold hover:text-blue-600 transition-colors truncate">
              <ArrowLeft className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">{course.title}</span>
            </Link>
          ) : (
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors">
              <List className="h-5 w-5" />
            </button>
          )}
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <ChevronDown className="h-5 w-5 transform rotate-90" />
            </button>
          )}
        </div>

        {/* Sidebar Content */}
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto">
            {course.modules?.map((mod, mIndex) => {
              const isExpanded = !!expandedModules[mod.id];
              const isModuleActive = mod.id === activeModule?.id;
              
              return (
                <div key={mod.id} className="border-b border-gray-200">
                  <button 
                    onClick={() => toggleModule(mod.id)}
                    className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isModuleActive ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Module {mIndex + 1}</div>
                      <div className={`font-semibold text-sm ${isModuleActive ? 'text-blue-900' : 'text-gray-900'}`}>{mod.title}</div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="bg-white">
                      {mod.lessons?.map((lesson, lIndex) => {
                        const isActive = lesson.id === activeLesson?.id;
                        return (
                          <Link
                            key={lesson.id}
                            to={`/learner/course/${course.id}/study/${lesson.id}`}
                            className={`flex items-start p-3 pl-6 border-l-4 transition-colors group ${isActive ? 'bg-blue-50 border-blue-600' : 'border-transparent hover:bg-gray-50'}`}
                          >
                            <div className={`mt-0.5 mr-3 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                              {getLessonIcon(lesson)}
                            </div>
                            <div className={`text-sm ${isActive ? 'font-semibold text-blue-900' : 'font-medium text-gray-700'}`}>
                              {lIndex + 1}. {lesson.title}
                            </div>
                          </Link>
                        );
                      })}
                      {(!mod.lessons || mod.lessons.length === 0) && (
                        <div className="p-3 pl-6 text-xs text-gray-400 italic">No lessons in this module.</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        
        {/* Mobile Header / Expand Sidebar Button */}
        {!sidebarOpen && (
          <div className="md:hidden absolute top-4 left-4 z-10">
            <button onClick={() => setSidebarOpen(true)} className="p-2 bg-gray-900 text-white rounded-md shadow-lg">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Desktop Expand Sidebar Button */}
        {!sidebarOpen && (
          <div className="hidden md:flex absolute top-4 left-4 z-10">
            <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white border border-gray-200 text-gray-600 rounded-md shadow-sm hover:bg-gray-50 flex items-center">
              <Menu className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Menu</span>
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {activeLesson ? (
            <div className="max-w-4xl mx-auto p-4 sm:p-8 lg:p-12">
              
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{activeLesson.title}</h1>
                <p className="text-sm text-gray-500 mt-2 font-medium">Module: {activeModule?.title}</p>
              </div>

              {/* Video Player */}
              {activeLesson.videoUrl && (
                <div className="mb-8 rounded-xl overflow-hidden bg-black shadow-lg aspect-video w-full">
                  <video src={activeLesson.videoUrl} controls autoPlay className="w-full h-full object-contain" />
                </div>
              )}

              {/* Text Content */}
              {activeLesson.content && (
                <div className="prose prose-blue max-w-none text-gray-800 whitespace-pre-wrap mb-8">
                  {activeLesson.content}
                </div>
              )}

              {/* Document Resource */}
              {parsedMeta?.type === 'document' && parsedMeta.url && (
                <div className="mt-8 p-6 border border-orange-200 bg-orange-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <FileText className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-orange-900">Document Resource</h4>
                      <p className="text-sm text-orange-700 mt-1">Review the attached material for this lesson.</p>
                    </div>
                  </div>
                  <a href={parsedMeta.url} target="_blank" rel="noreferrer" className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                    Open Document
                  </a>
                </div>
              )}

              {/* Quiz Resource */}
              {parsedMeta?.type === 'quiz' && parsedMeta.questions && (
                <div className="mt-8">
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-t-xl border-b-0">
                    <h3 className="text-xl font-bold text-blue-900 flex items-center">
                      <CheckCircle className="h-6 w-6 mr-2 text-blue-600" />
                      Knowledge Check Quiz
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">Test your understanding of the concepts covered in this lesson.</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-b-xl p-6 shadow-sm">
                    <div className="space-y-8">
                      {parsedMeta.questions.map((q: any, qIdx: number) => (
                        <div key={qIdx} className="bg-gray-50/50 p-6 rounded-lg border border-gray-100">
                          <p className="font-semibold text-gray-900 mb-4 text-lg">{qIdx + 1}. {q.question}</p>
                          <div className="space-y-3">
                            {q.options.map((opt: string, optIdx: number) => {
                              const isSelected = quizAnswers[qIdx] === optIdx;
                              const isCorrect = q.correctAnswer === optIdx;
                              const showResult = quizSubmitted;
                              
                              let bgClass = "bg-white border-gray-300 hover:bg-gray-50";
                              if (showResult) {
                                if (isCorrect) bgClass = "bg-green-50 border-green-400 text-green-900 ring-1 ring-green-400";
                                else if (isSelected && !isCorrect) bgClass = "bg-red-50 border-red-400 text-red-900";
                                else bgClass = "bg-white border-gray-200 opacity-60";
                              } else if (isSelected) {
                                bgClass = "bg-blue-50 border-blue-400 text-blue-900 ring-1 ring-blue-400";
                              }

                              return (
                                <label key={optIdx} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${bgClass}`}>
                                  <input 
                                    type="radio" 
                                    name={`quiz-q${qIdx}`}
                                    checked={isSelected}
                                    onChange={() => !quizSubmitted && setQuizAnswers(prev => ({...prev, [qIdx]: optIdx}))}
                                    disabled={quizSubmitted}
                                    className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                                  />
                                  <span className="text-base">{opt}</span>
                                  {showResult && isCorrect && <CheckCircle className="h-5 w-5 text-green-500 ml-auto shrink-0" />}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      {!quizSubmitted ? (
                        <button 
                          onClick={() => setQuizSubmitted(true)}
                          disabled={Object.keys(quizAnswers).length < parsedMeta.questions.length}
                          className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg shadow-sm"
                        >
                          Submit Answers
                        </button>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between bg-blue-50 p-6 rounded-lg border border-blue-100">
                          <div className="text-center sm:text-left">
                            <span className="block text-sm text-blue-600 font-semibold uppercase tracking-wider mb-1">Your Score</span>
                            <span className="text-3xl font-black text-blue-900">
                              {parsedMeta.questions.filter((q: any, i: number) => quizAnswers[i] === q.correctAnswer).length}
                              <span className="text-xl text-blue-400 mx-1">/</span>
                              {parsedMeta.questions.length}
                            </span>
                          </div>
                          <button 
                            onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                            className="px-6 py-2.5 bg-white text-blue-600 border border-blue-200 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-sm"
                          >
                            Retake Quiz
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Navigation */}
              <div className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
                {prevLesson ? (
                  <Link 
                    to={`/learner/course/${course.id}/study/${prevLesson.id}`}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <ChevronDown className="h-4 w-4 transform rotate-90 mr-2" />
                    Previous: {prevLesson.title}
                  </Link>
                ) : (
                  <div></div>
                )}
                
                {nextLesson && (
                  <Link 
                    to={`/learner/course/${course.id}/study/${nextLesson.id}`}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Next: {nextLesson.title}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                )}
              </div>
              
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <PlayCircle className="h-16 w-16 mb-4 opacity-50" />
              <h2 className="text-xl font-medium text-gray-600">Select a lesson from the sidebar to begin</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnerStudyPage;
