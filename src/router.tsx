import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import NoteEditor from './pages/NoteEditorPage';
import UploadPage from './pages/Upload';
export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="posts/:id" element={<Posts />} />
        <Route path="categories" element={<Categories />} />
        <Route path="note-editor" element={<NoteEditor />} />
        <Route path="upload" element={<UploadPage />} />
      </Route>
    </Routes>
  );
} 