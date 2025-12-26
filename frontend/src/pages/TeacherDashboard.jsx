import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, enrollmentAPI, voucherAPI } from '../services/api';
import { BookOpen, Plus, Users, AlertCircle, Trash2, X, Eye } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    pendingVouchers: 0,
    pendingEnrollments: 0,
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    loadDashboardData();
    window.addEventListener('voucher-processed', loadDashboardData);
    return () => window.removeEventListener('voucher-processed', loadDashboardData);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [coursesRes, vouchersRes, enrollmentsRes] = await Promise.all([
        courseAPI.getMyCourses(),
        voucherAPI.getAll(),
        enrollmentAPI.getAll(),
      ]);

      const coursesData = coursesRes.data;
      const vouchersData = vouchersRes.data;
      const enrollmentsData = enrollmentsRes.data;

      setCourses(coursesData);

      const totalStudents = enrollmentsData.filter(e => e.is_approved).length;
      const pendingEnrollments = enrollmentsData.filter(e => !e.is_approved).length;

      setStats({
        totalCourses: coursesData.length,
        totalStudents,
        pendingVouchers: vouchersData.filter(v => v.status === 'pending').length,
        pendingEnrollments,
      });
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (course) => {
    setSelectedCourse(course);
    setDeleteConfirmText('');
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmText !== 'ELIMINAR CURSO') {
      alert('Debes escribir exactamente "ELIMINAR CURSO" para confirmar');
      return;
    }

    try {
      await courseAPI.delete(selectedCourse.id);
      alert('Curso eliminado exitosamente');
      setShowDeleteModal(false);
      setDeleteConfirmText('');
      loadDashboardData();
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      alert('Error al eliminar el curso');
    }
  };

  const courseColors = [
    '#1967D2', '#D93025', '#0F9D58', '#F9AB00', '#AB47BC', '#00897B',
  ];

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <DashboardSidebar />

      <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-normal text-gray-800 dark:text-gray-100">Mis Cursos</h1>
          <Link
            to="/teacher/courses/new"
            className="bg-blue-600 dark:bg-blue-500 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
          >
            <Plus size={18} />
            <span>Crear Curso</span>
          </Link>
        </div>

        {/* Alertas de pendientes */}
        {stats.pendingEnrollments > 0 && (
          <div className="mb-4 md:mb-6 space-y-2 md:space-y-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-3 md:p-4 rounded">
              <div className="flex items-center">
                <AlertCircle className="text-blue-600 dark:text-blue-400 mr-2 md:mr-3 flex-shrink-0" size={18} />
                <p className="text-blue-700 dark:text-blue-300 text-xs md:text-sm">
                  Tienes <span className="font-semibold">{stats.pendingEnrollments}</span> inscripción(es) pendiente(s)
                </p>
              </div>
            </div>
          </div>
        )}


        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <img
              src="/empty_state.png"
              alt="No hay cursos"
              className="w-40 h-40 md:w-48 md:h-48 object-contain mb-3 md:mb-4"
            />
            <p className="text-gray-600 dark:text-gray-400 mb-3 md:mb-4 text-sm md:text-base text-center">
              No has creado ningún curso todavía
            </p>
            <Link
              to="/teacher/courses/new"
              className="bg-blue-600 text-white px-5 md:px-6 py-2 md:py-2.5 rounded-md hover:bg-blue-700 font-medium transition-colors flex items-center space-x-2 text-sm md:text-base"
            >
              <Plus size={18} />
              <span>Crear Curso</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <BookOpen className="text-white" size={64} />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {course.description || 'Curso sin descripción'}
                  </p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users size={16} />
                        <span>{course.total_students || 0} estudiantes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen size={16} />
                        <span>{course.total_lessons || 0} lecciones</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {course.is_paid ? `S/ ${course.price}` : 'Gratis'}
                    </span>
                    <div className="flex items-center">
                      <Link
                        to={`/courses/${course.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mr-1"
                        title="Vista de estudiante"
                      >
                        <Eye size={20} />
                      </Link>
                      <Link
                        to={`/teacher/courses/${course.id}/edit`}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(course)}
                        className="ml-2 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Eliminar curso"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Course Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Confirmar Eliminación</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                ¿Estás seguro que deseas eliminar el curso <strong>{selectedCourse?.title}</strong>? Esta acción borrará todas las lecciones, inscripciones y progreso asociado. No se puede deshacer.
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Para confirmar, escribe <strong>ELIMINAR CURSO</strong>
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Escribe aquí..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteConfirmText !== 'ELIMINAR CURSO'}
                  className={`flex-1 px-4 py-2 rounded-md transition-colors ${deleteConfirmText === 'ELIMINAR CURSO'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
};

export default TeacherDashboard;
