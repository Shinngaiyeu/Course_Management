import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { UserManagementPage } from './pages/Users/UserManagementPage';
import LoginPage from './pages/Auth/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import DepartmentManagementPage from './pages/Departments/DepartmentManagementPage';
import SyncLogPage from './pages/SyncLogs/SyncLogPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/users" replace />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="departments" element={<DepartmentManagementPage />} />
            <Route path="sync-logs" element={<SyncLogPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
