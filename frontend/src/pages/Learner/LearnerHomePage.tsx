import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService, Course, PagedResult } from '@/services/courseService';
import { PlayCircle, Clock, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export const LearnerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [pagedData, setPagedData] = useState<PagedResult<Course>>({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Learner API call automatically filters for published only in backend
        const data = await courseService.getCourses(1, 20);
        setPagedData(data);
      } catch (error) {
        console.error('Failed to fetch courses', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Unlock your potential
          </h1>
          <p className="text-xl md:text-2xl font-light text-blue-100 max-w-2xl">
            Explore our curated catalog of premium courses designed to elevate your skills and career.
          </p>
        </div>
      </div>

      {/* Main Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">What to learn next</h2>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pagedData.items.map((course) => (
              <div 
                key={course.id} 
                onClick={() => navigate(`/learner/course/${course.id}`)}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col h-full group"
              >
                {/* Course Thumbnail Placeholder */}
                <div className="h-40 bg-gray-200 relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-gray-400 group-hover:text-blue-600 transition-colors opacity-50 group-hover:opacity-100 z-20" />
                  </div>
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-gray-900 leading-tight mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{course.instructorName || 'Expert Instructor'}</p>
                  
                  <div className="flex items-center text-sm text-yellow-500 font-bold mb-2">
                    4.8 <Star className="h-4 w-4 ml-1 fill-current" />
                    <span className="text-xs font-normal text-gray-400 ml-1">(1,234)</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mt-auto">
                    {course.description || 'Discover the fundamentals and advanced techniques in this comprehensive course.'}
                  </p>
                </div>
              </div>
            ))}

            {pagedData.items.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500">
                <p className="text-lg">No published courses available yet.</p>
                <p className="text-sm mt-2">Check back later for new content!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnerHomePage;
