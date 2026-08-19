import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { UserManagementPage } from './pages/Users/UserManagementPage';
import LoginPage from './pages/Auth/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import DepartmentManagementPage from './pages/Departments/DepartmentManagementPage';
import SyncLogPage from './pages/SyncLogs/SyncLogPage';
import CourseManagementPage from './pages/Courses/CourseManagementPage';
import CourseDetailsPage from './pages/Courses/CourseDetailsPage';
import { LearnerLayout } from './layouts/LearnerLayout';
import LearnerHomePage from './pages/Learner/LearnerHomePage';
import LearnerCourseDetailsPage from './pages/Learner/LearnerCourseDetailsPage';
import LearnerStudyPage from './pages/Learner/LearnerStudyPage';
import Settings from './pages/Settings/Settings';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/users" replace />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="departments" element={<DepartmentManagementPage />} />
            <Route path="courses" element={<CourseManagementPage />} />
            <Route path="courses/:id" element={<CourseDetailsPage />} />
            <Route path="sync-logs" element={<SyncLogPage />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {}
          <Route path="/learner" element={<LearnerLayout />}>
            <Route index element={<LearnerHomePage />} />
            <Route path="course/:id" element={<LearnerCourseDetailsPage />} />
            <Route path="course/:courseId/study/:lessonId?" element={<LearnerStudyPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
