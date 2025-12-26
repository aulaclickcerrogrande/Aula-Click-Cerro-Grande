import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { BookOpen, Plus } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import VoucherNotifications from '../components/VoucherNotifications';

const StudentDashboard = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    try {
      const response = await courseAPI.getMyCourses();
      setMyCourses(response.data);
    } catch (error) {
      console.error('Error al cargar mis cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Colores predefinidos para las tarjetas de cursos (estilo Classroom)
  const courseColors = [
    '#1967D2', // Azul
    '#D93025', // Rojo
    '#0F9D58', // Verde
    '#F9AB00', // Amarillo
    '#AB47BC', // Morado
    '#00897B', // Turquesa
  ];

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <DashboardSidebar />

      <main className="ml-64 flex-1 p-8">
        <VoucherNotifications />
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : myCourses.length === 0 ? (
          // Empty State estilo Classroom
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <img
              src="/empty_state.png"
              alt="No hay cursos"
              className="w-64 h-64 object-contain mb-6"
            />
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
              Agrega un curso para empezar
            </p>
            <Link
              to="/courses"
              className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-colors"
            >
              Explorar cursos
            </Link>
          </div>
        ) : (
          // Grid de cursos con diseño detallado
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">Mis Cursos</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >
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
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {course.description || 'Curso sin descripción'}
                    </p>

                    {/* Barra de progreso */}
                    {course.progress_percentage !== undefined && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progreso</span>
                          <span className="font-semibold">{course.progress_percentage || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress_percentage || 0}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <BookOpen size={16} />
                        <span>{course.total_lessons || 0} lecciones</span>
                      </div>
                      <span className="text-primary-600 dark:text-primary-400 font-semibold group-hover:underline">
                        Continuar →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
