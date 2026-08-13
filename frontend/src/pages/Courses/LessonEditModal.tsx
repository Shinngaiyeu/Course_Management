import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Trash2, PlusCircle, HelpCircle, FileText, Video, Loader2 } from 'lucide-react';
import { courseService } from '@/services/courseService';
import toast from 'react-hot-toast';

interface LessonEditModalProps {
  moduleId: number;
  lesson: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
}

type LessonType = 'text' | 'video' | 'document' | 'quiz';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export const LessonEditModal: React.FC<LessonEditModalProps> = ({ moduleId, lesson, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const [lessonType, setLessonType] = useState<LessonType>('text');

  const [videoUrl, setVideoUrl] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');

  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');

  const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(null);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string>('');

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    { question: '', options: ['', ''], correctAnswer: 0 }
  ]);

  useEffect(() => {
    if (lesson && isOpen) {
      setTitle(lesson.title);
      setContent(lesson.content || '');
      setOrderIndex(lesson.orderIndex);

      let parsedMeta: any = {};
      try {
        if (lesson.metadata) {
          parsedMeta = JSON.parse(lesson.metadata);
        }
      } catch (e) {}

      if (parsedMeta.type === 'quiz') {
        setLessonType('quiz');
        if (Array.isArray(parsedMeta.questions) && parsedMeta.questions.length > 0) {
          setQuizQuestions(parsedMeta.questions);
        } else if (parsedMeta.question) {
          setQuizQuestions([{
            question: parsedMeta.question,
            options: parsedMeta.options || ['', ''],
            correctAnswer: parsedMeta.correctAnswer || 0
          }]);
        } else {
          setQuizQuestions([{ question: '', options: ['', ''], correctAnswer: 0 }]);
        }
        setVideoUrl('');
        setDocumentUrl('');
      } else if (parsedMeta.type === 'document') {
        setLessonType('document');
        setDocumentUrl(parsedMeta.url || '');
        setVideoUrl('');
      } else if (lesson.videoUrl) {
        setLessonType('video');
        setVideoUrl(lesson.videoUrl);
        setDocumentUrl('');
      } else {
        setLessonType('text');
        setVideoUrl('');
        setDocumentUrl('');
      }

      setSelectedVideoFile(null);
      setVideoPreviewUrl('');
      setSelectedDocumentFile(null);
      setDocumentPreviewUrl('');
      setIsSaving(false);

    } else if (isOpen) {
      setTitle('');
      setContent('');
      setOrderIndex(0);
      setLessonType('text');
      setVideoUrl('');
      setDocumentUrl('');
      setQuizQuestions([{ question: '', options: ['', ''], correctAnswer: 0 }]);
      setSelectedVideoFile(null);
      setVideoPreviewUrl('');
      setSelectedDocumentFile(null);
      setDocumentPreviewUrl('');
      setIsSaving(false);
    }
  }, [lesson, isOpen]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl && videoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      if (documentPreviewUrl && documentPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(documentPreviewUrl);
      }
    };
  }, [videoPreviewUrl, documentPreviewUrl]);

  const handleAddQuestion = () => {
    setQuizQuestions([...quizQuestions, { question: '', options: ['', ''], correctAnswer: 0 }]);
  };

  const handleRemoveQuestion = (qIdx: number) => {
    if (quizQuestions.length <= 1) return;
    const newQs = [...quizQuestions];
    newQs.splice(qIdx, 1);
    setQuizQuestions(newQs);
  };

  const handleUpdateQuestionText = (qIdx: number, val: string) => {
    const newQs = [...quizQuestions];
    newQs[qIdx].question = val;
    setQuizQuestions(newQs);
  };

  const handleAddOption = (qIdx: number) => {
    const newQs = [...quizQuestions];
    newQs[qIdx].options.push('');
    setQuizQuestions(newQs);
  };

  const handleRemoveOption = (qIdx: number, optIdx: number) => {
    const newQs = [...quizQuestions];
    if (newQs[qIdx].options.length <= 2) return;
    newQs[qIdx].options.splice(optIdx, 1);

    let ca = newQs[qIdx].correctAnswer;
    if (ca >= newQs[qIdx].options.length) {
      newQs[qIdx].correctAnswer = Math.max(0, newQs[qIdx].options.length - 1);
    } else if (ca === optIdx) {
      newQs[qIdx].correctAnswer = 0;
    } else if (ca > optIdx) {
      newQs[qIdx].correctAnswer = ca - 1;
    }

    setQuizQuestions(newQs);
  };

  const handleOptionChange = (qIdx: number, optIdx: number, val: string) => {
    const newQs = [...quizQuestions];
    newQs[qIdx].options[optIdx] = val;
    setQuizQuestions(newQs);
  };

  const handleSetCorrectAnswer = (qIdx: number, optIdx: number) => {
    const newQs = [...quizQuestions];
    newQs[qIdx].correctAnswer = optIdx;
    setQuizQuestions(newQs);
  };

  const handleVideoSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedVideoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(objectUrl);
    setVideoUrl('');
  };

  const handleDocumentSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedDocumentFile(file);
    const objectUrl = URL.createObjectURL(file);
    setDocumentPreviewUrl(objectUrl);
    setDocumentUrl('');
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      let finalMetadata = '';
      let finalVideoUrl = videoUrl;
      let finalDocumentUrl = documentUrl;

      if (lessonType === 'video' && selectedVideoFile) {
        finalVideoUrl = await courseService.uploadFile(selectedVideoFile);
      } else if (lessonType === 'document' && selectedDocumentFile) {
        finalDocumentUrl = await courseService.uploadFile(selectedDocumentFile);
      }

      if (lessonType === 'document') {
        finalMetadata = JSON.stringify({ type: 'document', url: finalDocumentUrl });
      } else if (lessonType === 'quiz') {
        finalMetadata = JSON.stringify({
          type: 'quiz',
          questions: quizQuestions
        });
      }

      onSave({
        courseModuleId: moduleId,
        title,
        content,
        videoUrl: lessonType === 'video' ? finalVideoUrl : '',
        metadata: finalMetadata,
        orderIndex
      });

    } catch (err) {
      toast.error('Failed to save lesson or upload file.');
    } finally {
      setIsSaving(false);
    }
  };

  const isSaveDisabled = () => {
    if (!title || isSaving) return true;
    if (lessonType === 'quiz') {
      for (const q of quizQuestions) {
        if (!q.question.trim()) return true;
        if (q.options.some(o => !o.trim())) return true;
      }
    }
    return false;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lesson ? 'Edit Lesson' : 'Add New Lesson'}>
      <div className="space-y-4 max-h-[75vh] overflow-y-auto px-1 pb-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Getting Started with React"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Type</label>
          <select
            value={lessonType}
            onChange={(e) => setLessonType(e.target.value as LessonType)}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          >
            <option value="text">Text / Article</option>
            <option value="video">Video (Cloudinary/YouTube)</option>
            <option value="document">Document (PDF)</option>
            <option value="quiz">Interactive Quiz</option>
          </select>
        </div>

        {}
        {lessonType === 'video' && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <label className="block text-sm font-medium text-blue-900 mb-1">Video Source</label>
            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoSelection}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
              />

              <div className="text-center text-xs text-blue-500 font-medium">OR ENTER URL</div>

              <input
                type="text"
                value={videoUrl}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                  setSelectedVideoFile(null);
                  setVideoPreviewUrl('');
                }}
                className="block w-full border border-blue-200 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter YouTube or Cloudinary URL"
              />

              {}
              {(videoPreviewUrl || videoUrl) && (
                <div className="mt-2 rounded-md overflow-hidden bg-black aspect-video relative flex items-center justify-center">
                  <video
                    src={videoPreviewUrl || videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {lessonType === 'document' && (
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <label className="block text-sm font-medium text-orange-900 mb-1">Document (PDF) Source</label>
            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleDocumentSelection}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer"
              />

              <div className="text-center text-xs text-orange-500 font-medium">OR ENTER URL</div>

              <input
                type="text"
                value={documentUrl}
                onChange={(e) => {
                  setDocumentUrl(e.target.value);
                  setSelectedDocumentFile(null);
                  setDocumentPreviewUrl('');
                }}
                className="block w-full border border-orange-200 rounded-md px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter Document URL"
              />

              {}
              {(documentPreviewUrl || documentUrl) && (
                <div className="mt-2 h-40 bg-white border border-orange-200 rounded-md flex items-center justify-center flex-col text-orange-400">
                  <FileText className="h-10 w-10 mb-2" />
                  <span className="text-sm">Document Selected for Upload</span>
                  <span className="text-xs text-gray-400 mt-1">{selectedDocumentFile?.name}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {lessonType === 'quiz' && (
          <div className="space-y-4">
            {quizQuestions.map((q, qIdx) => (
              <div key={qIdx} className="bg-purple-50 p-4 rounded-lg border border-purple-200 relative">
                {quizQuestions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="absolute top-2 right-2 p-1.5 text-purple-400 hover:text-red-600 bg-white rounded-full shadow-sm hover:shadow transition-all"
                    title="Delete Question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}

                <h4 className="text-sm font-bold text-purple-800 mb-3 flex items-center">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Question {qIdx + 1}
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-purple-900 mb-1">Question Content</label>
                    <textarea
                      value={q.question}
                      onChange={(e) => handleUpdateQuestionText(qIdx, e.target.value)}
                      rows={2}
                      className="block w-full border border-purple-200 rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
                      placeholder="Enter question text here..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-purple-900 mb-2">Options & Correct Answer (Radio)</label>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correctAnswer-${qIdx}`}
                            checked={q.correctAnswer === optIdx}
                            onChange={() => handleSetCorrectAnswer(qIdx, optIdx)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                            title="Mark as correct answer"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                            className={`block w-full border rounded-md px-3 py-1.5 text-sm focus:ring-purple-500 focus:border-purple-500 bg-white ${q.correctAnswer === optIdx ? 'border-purple-400 bg-purple-50' : 'border-purple-200'}`}
                            placeholder={`Option ${optIdx + 1}`}
                          />
                          {q.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(qIdx, optIdx)}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-md border border-transparent hover:border-red-100"
                              title="Remove option"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddOption(qIdx)}
                      className="mt-3 text-xs text-purple-700 font-semibold flex items-center hover:text-purple-900 transition-colors px-2 py-1 bg-purple-100 rounded-md hover:bg-purple-200"
                    >
                      <PlusCircle className="h-3 w-3 mr-1" /> Add Option
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 font-semibold flex items-center justify-center hover:bg-purple-50 hover:border-purple-400 transition-all"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Add Another Question
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Main Content (Markdown / Text)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder={lessonType === 'text' ? "Write your lesson content here..." : "Add some optional context or instructions here..."}
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

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 mt-4">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaveDisabled()}>
            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isSaving ? 'Saving & Uploading...' : 'Save Lesson'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
