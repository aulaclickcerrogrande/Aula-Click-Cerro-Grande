import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CoursesList from './pages/CoursesList';
import CourseDetail from './pages/CourseDetail';
import LessonView from './pages/LessonView';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import CourseForm from './pages/CourseForm';
import LessonForm from './pages/LessonForm';
import Settings from './pages/Settings';
import ManageStudents from './pages/ManageStudents';
import ForgotPassword from './pages/ForgotPassword';
import WhoWeAre from './pages/WhoWeAre';

function AppContent() {
  const location = useLocation();
  const isDashboardPage = location.pathname.includes('/dashboard') || location.pathname.includes('/settings') || location.pathname.includes('/courses') || location.pathname.includes('/teacher/students');

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/nosotros" element={<WhoWeAre />} />

          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CoursesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/lessons/:lessonId"
            element={
              <ProtectedRoute>
                <LessonView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requireRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute requireRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/students"
            element={
              <ProtectedRoute requireRole="teacher">
                <ManageStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/courses/new"
            element={
              <ProtectedRoute requireRole="teacher">
                <CourseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/courses/:id/edit"
            element={
              <ProtectedRoute requireRole="teacher">
                <CourseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/courses/:courseId/lessons/new"
            element={
              <ProtectedRoute requireRole="teacher">
                <LessonForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/courses/:courseId/lessons/:lessonId/edit"
            element={
              <ProtectedRoute requireRole="teacher">
                <LessonForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboardPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
