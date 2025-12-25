import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { BookOpen, Users, TrendingUp, ArrowRight, Clock, DollarSign, UserPlus, LogIn, MessageCircle, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VoucherNotifications from '../components/VoucherNotifications';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const scrollToCourses = () => {
    const coursesSection = document.getElementById('cursos-disponibles');
    if (coursesSection) {
      const headerOffset = 100; // Altura del header + un poco de padding
      const elementPosition = coursesSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <VoucherNotifications />
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary-200 dark:bg-primary-900 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-12 lg:py-0">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center lg:-mt-20">
            {/* Lado izquierdo: Logo + Textos */}
            <div className="text-center lg:text-left space-y-6 lg:pl-12">
              <div className="inline-block lg:block">
                <img
                  src="/logo.png"
                  alt="Cerro Grande"
                  className="h-40 w-auto mx-auto lg:mx-0 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-3">
                <p className="text-lg md:text-2xl font-light text-gray-600 dark:text-gray-400 tracking-wide">
                  Bienvenido a
                </p>
                <h1 className="text-4xl md:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
                    Aula Click
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-white">Cerro Grande</span>
                </h1>
              </div>
              <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                Aprende a tu ritmo con los mejores cursos online. Educación de calidad al alcance de todos.
              </p>
            </div>

            {/* Lado derecho: Botones verticales estilo minimalista */}
            <div className="flex flex-col gap-4 max-w-md mx-auto lg:mx-0 w-full lg:pl-16">
              {!user && (
                <>
                  <h3 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white text-center lg:text-left mb-2">
                    ¡Comienza tu camino educativo!
                  </h3>
                  <Link to="/register" className="group px-6 py-4 bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 font-semibold rounded-xl transition-all duration-200 flex items-center justify-between border border-blue-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <UserPlus size={20} />
                      <span>Comenzar Ahora</span>
                    </div>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                  <button onClick={scrollToCourses} className="group px-6 py-4 bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 font-semibold rounded-xl transition-all duration-200 flex items-center justify-between border border-blue-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <BookOpen size={20} />
                      <span>Ver Cursos</span>
                    </div>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </button>
                  <Link to="/login" className="group px-6 py-4 bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 font-semibold rounded-xl transition-all duration-200 flex items-center justify-between border border-blue-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <LogIn size={20} />
                      <span>Iniciar Sesión</span>
                    </div>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                  <a href="https://wa.me/51999574257" target="_blank" rel="noopener noreferrer" className="group px-6 py-4 bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 font-semibold rounded-xl transition-all duration-200 flex items-center justify-between border border-blue-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <MessageCircle size={20} />
                      <span>Contactar por WhatsApp</span>
                    </div>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </a>
                </>
              )}
              {user && (
                <>
                  <Link
                    to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                    className="group px-6 py-4 bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 font-semibold rounded-xl transition-all duration-200 flex items-center justify-between border border-blue-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard size={20} />
                      <span>Ir a mi Dashboard</span>
                    </div>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                  <button onClick={scrollToCourses} className="group px-6 py-4 bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 font-semibold rounded-xl transition-all duration-200 flex items-center justify-between border border-blue-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <BookOpen size={20} />
                      <span>Ver Cursos</span>
                    </div>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-block p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                <BookOpen className="text-primary-600 dark:text-primary-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Cursos de Calidad</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Contenido educativo desarrollado por profesional experimentado
              </p>
            </div>

            <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-block p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                <Clock className="text-primary-600 dark:text-primary-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Aprende a tu Ritmo</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Accede al contenido cuando quieras y avanza según tu disponibilidad
              </p>
            </div>

            <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-block p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                <TrendingUp className="text-primary-600 dark:text-primary-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Guarda tu Progreso</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tu avance se registra automáticamente para continuar donde lo dejaste
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="cursos-disponibles" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Cursos Disponibles</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Explora nuestra oferta educativa</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Cargando cursos...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <BookOpen className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Próximamente</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Estamos preparando cursos increíbles para ti. ¡Vuelve pronto!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="card group">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <BookOpen size={18} className="mr-1" />
                        <span className="text-sm">{course.total_lessons} lecciones</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        {course.is_paid ? `S/ ${course.price}` : 'Gratis'}
                      </span>
                      <Link
                        to={user ? `/courses/${course.id}` : '/login'}
                        className="flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700"
                      >
                        <span>Ver más</span>
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
