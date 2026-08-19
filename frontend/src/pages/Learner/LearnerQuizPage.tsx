import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService, Course } from '@/services/courseService';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const LearnerQuizPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizMeta, setQuizMeta] = useState<any>(null);

  useEffect(() => {
    const fetchCourseAndLesson = async () => {
      try {
        if (!courseId || !lessonId) return;
        setLoading(true);
        const data = await courseService.getCourse(Number(courseId));
        setCourse(data);

        // Find the specific lesson
        let foundLesson = null;
        if (data.modules) {
          for (const mod of data.modules) {
            if (mod.lessons) {
              const l = mod.lessons.find((x: any) => x.id === Number(lessonId));
              if (l) {
                foundLesson = l;
                break;
              }
            }
          }
        }

        if (foundLesson) {
          setLesson(foundLesson);
          if (foundLesson.metadata) {
            try {
              const meta = JSON.parse(foundLesson.metadata);
              if (meta.type === 'quiz' && meta.questions) {
                setQuizMeta(meta);
              } else {
                toast.error('This lesson does not contain a quiz.');
                navigate(`/learner/course/${courseId}`);
              }
            } catch (e) {
              toast.error('Invalid quiz data.');
              navigate(`/learner/course/${courseId}`);
            }
          }
        } else {
          toast.error('Lesson not found.');
          navigate(`/learner/course/${courseId}`);
        }
      } catch (error) {
        toast.error('Failed to load quiz details');
        navigate(`/learner`);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndLesson();
  }, [courseId, lessonId, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!course || !lesson || !quizMeta) return null;

  return (
    <div className="w-full pb-20">
      {/* Header */}
      <div className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <button 
              onClick={() => navigate(`/learner/course/${courseId}`)}
              className="flex items-center text-gray-400 hover:text-white transition-colors mb-2 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Course
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">{lesson.title} - Quiz</h1>
            <p className="text-gray-400 text-sm mt-1">Course: {course.title}</p>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="mb-8 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900">Knowledge Check</h2>
            <p className="text-gray-500 mt-1">Answer the following questions to test your understanding.</p>
          </div>

          <div className="space-y-8">
            {quizMeta.questions.map((q: any, qIdx: number) => (
              <div key={qIdx} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <p className="font-medium text-lg text-gray-900 mb-4">{qIdx + 1}. {q.question}</p>
                <div className="space-y-3">
                  {q.options.map((opt: string, optIdx: number) => {
                    const isSelected = quizAnswers[qIdx] === optIdx;
                    const isCorrect = q.correctAnswer === optIdx;
                    const showResult = quizSubmitted;
                    
                    let bgClass = "bg-white border-gray-300 hover:bg-gray-50";
                    if (showResult) {
                      if (isCorrect) bgClass = "bg-green-50 border-green-400 text-green-900";
                      else if (isSelected && !isCorrect) bgClass = "bg-red-50 border-red-400 text-red-900";
                      else bgClass = "bg-white border-gray-200 opacity-60";
                    } else if (isSelected) {
                      bgClass = "bg-blue-50 border-blue-400 text-blue-900";
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
                        {showResult && isCorrect && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-200">
            {!quizSubmitted ? (
              <button 
                onClick={() => setQuizSubmitted(true)}
                disabled={Object.keys(quizAnswers).length < quizMeta.questions.length}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
              >
                Submit Answers
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-between bg-blue-50 p-6 rounded-lg border border-blue-100">
                <div className="text-center sm:text-left">
                  <span className="block text-sm text-blue-600 font-semibold uppercase tracking-wider mb-1">Your Score</span>
                  <span className="text-3xl font-black text-blue-900">
                    {quizMeta.questions.filter((q: any, i: number) => quizAnswers[i] === q.correctAnswer).length}
                    <span className="text-xl text-blue-400 mx-1">/</span>
                    {quizMeta.questions.length}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                    className="px-6 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    Retake Quiz
                  </button>
                  <button 
                    onClick={() => navigate(`/learner/course/${courseId}`)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Back to Course
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerQuizPage;
