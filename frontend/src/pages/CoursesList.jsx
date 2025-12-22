import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { BookOpen, Users, Search, DollarSign, Filter, CheckCircle } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import { useAuth } from '../context/AuthContext';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, filter, courses]);

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter === 'free') {
      filtered = filtered.filter(course => !course.is_paid);
    } else if (filter === 'paid') {
      filtered = filtered.filter(course => course.is_paid);
    }

    setFilteredCourses(filtered);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <DashboardSidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Catálogo de Cursos</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isTeacher ? 'Gestiona y visualiza los cursos disponibles' : 'Explora y encuentra el curso perfecto para ti'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-600 dark:text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Todos</option>
                  <option value="free">Gratis</option>
                  <option value="paid">De Pago</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando cursos...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                {searchTerm ? 'No se encontraron cursos' : 'Próximamente'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Estamos preparando cursos increíbles para ti'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >
                  <div className="relative">
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
                    {/* Badge de Inscrito */}
                    {course.is_enrolled && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                        <CheckCircle size={16} />
                        <span className="text-xs font-semibold">Inscrito</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <BookOpen size={16} />
                        <span>{course.total_lessons} lecciones</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {course.is_paid ? `S/ ${course.price}` : 'Gratis'}
                      </span>
                      <span className="text-primary-600 dark:text-primary-400 font-semibold group-hover:underline">
                        Ver más →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CoursesList;
