import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseAPI, statsAPI } from '../services/api';
import BrandTitle from '../components/BrandTitle';
import { BookOpen, Users, TrendingUp, ArrowRight, Clock, DollarSign, UserPlus, LogIn, MessageCircle, LayoutDashboard, Calendar, MapPin, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VoucherNotifications from '../components/VoucherNotifications';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visitorCount, setVisitorCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollToCourses = () => {
    const coursesSection = document.getElementById('cursos-disponibles');
    if (coursesSection) {
      const headerOffset = 100;
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
    handleVisitorCount();
  }, []);

  const handleVisitorCount = async () => {
    try {
      // Incrementar visita al cargar la página
      const response = await statsAPI.getVisitorCount(true);
      setVisitorCount(response.data.visitor_count);
    } catch (error) {
      console.error('Error al manejar contador de visitas:', error);
    }
  };

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
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden transition-colors duration-300 py-12 md:p-0">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-20 md:opacity-30 dark:opacity-10 md:dark:opacity-20">
          <div className="absolute top-10 md:top-20 right-10 md:right-20 w-40 h-40 md:w-72 md:h-72 bg-primary-200 dark:bg-primary-900 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-12 md:py-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">

            {/* Columna 1: Logo + Titulo (4 cols) */}
            <div className="lg:col-span-4 text-center lg:text-left space-y-6">
              <div className="inline-block lg:block">
                <img
                  src="/logo.png"
                  alt="Aula Click Cerro Grande"
                  className="h-24 md:h-32 lg:h-36 w-auto mx-auto lg:mx-0 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-4">
                <p className="text-lg md:text-xl font-light text-gray-600 dark:text-gray-400 tracking-wide">
                  Bienvenido a
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <BrandTitle />
                </h1>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                  Aprende a tu ritmo con los mejores cursos online. Educación de calidad al alcance de todos.
                </p>
              </div>
            </div>

            {/* Columna 2: Botones de Acción (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4 w-full">
              {!user ? (
                <>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center lg:text-left mb-2">
                    ¡Comienza tu camino!
                  </h3>
                  <Link to="/register" className="group px-6 py-4 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold rounded-2xl transition-all duration-300 flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
                        <UserPlus size={20} />
                      </div>
                      <span>Registrarme gratis</span>
                    </div>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                  <button onClick={scrollToCourses} className="group px-6 py-4 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold rounded-2xl transition-all duration-300 flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
                        <BookOpen size={20} />
                      </div>
                      <span>Explorar Cursos</span>
                    </div>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </button>
                  <Link to="/login" className="group px-6 py-4 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold rounded-2xl transition-all duration-300 flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
                        <LogIn size={20} />
                      </div>
                      <span>Iniciar Sesión</span>
                    </div>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                  <a href="https://wa.me/51999574257" target="_blank" rel="noopener noreferrer" className="group px-6 py-4 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 font-bold rounded-2xl transition-all duration-300 flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                        <MessageCircle size={20} />
                      </div>
                      <span> WhatsApp</span>
                    </div>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </a>
                </>
              ) : (
                <>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center lg:text-left mb-2">
                    ¡Qué bueno verte!
                  </h3>
                  <Link
                    to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                    className="group px-6 py-4 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold rounded-2xl transition-all duration-300 flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
                        <LayoutDashboard size={20} />
                      </div>
                      <span>Mi Panel de Control</span>
                    </div>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                  <button onClick={scrollToCourses} className="group px-6 py-4 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold rounded-2xl transition-all duration-300 flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
                        <BookOpen size={20} />
                      </div>
                      <span>Mis Cursos</span>
                    </div>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Columna 3: Widgets Side (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Calendario */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transform hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-2 mb-3 text-primary-600 dark:text-primary-400 font-bold">
                  <Calendar size={18} />
                  <span className="text-sm">Próximos Eventos</span>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square lg:aspect-video relative">
                  <iframe
                    src="https://calendar.google.com/calendar/embed?height=300&wkst=1&bgcolor=%23ffffff&ctz=America%2FLima&showTitle=0&showNav=1&showDate=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&hl=es&src=ZXMucGUjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%230B8043"
                    className="absolute inset-0 w-full h-full border-0"
                    title="Calendario Aula Click"
                  />
                </div>
              </div>

              {/* Mapa */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transform hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-2 mb-3 text-red-500 font-bold">
                  <MapPin size={18} />
                  <span className="text-sm">¿Dónde estamos?</span>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square lg:aspect-video relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.832961554522!2d-78.3475266!3d-6.0857329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91b2c452b8006bfb%3A0xc3191d9667f537f!2sCerro%20Grande!5e0!3m2!1ses-419!2spe!4v1710000000000!5m2!1ses-419!2spe"
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación Cerro Grande"
                  />
                </div>
              </div>

              {/* Contador de Visitas */}
              <div className="bg-primary-600 dark:bg-primary-700 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between transform hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Eye size={24} />
                  </div>
                  <div>
                    <p className="text-xs opacity-80 font-medium">Visitas totales</p>
                    <p className="text-2xl font-black">{visitorCount.toLocaleString()}</p>
                  </div>
                </div>
                <Users size={32} className="opacity-20" />
              </div>
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
