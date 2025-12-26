import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseAPI, voucherAPI, uploadAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Clock, Users, Lock, CheckCircle, Upload, AlertCircle, ArrowLeft, X } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherFile, setVoucherFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const response = await courseAPI.getById(id);
      setCourse(response.data);
    } catch (error) {
      console.error('Error al cargar curso:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (course.is_paid) {
      setShowVoucherModal(true);
      return;
    }

    setEnrolling(true);
    try {
      await courseAPI.enroll(id);
      loadCourse();
      alert('¡Inscripción exitosa!');
    } catch (error) {
      console.error('Error al inscribirse:', error);
      alert('Error al inscribirse en el curso');
    } finally {
      setEnrolling(false);
    }
  };

  const handleVoucherUpload = async (e) => {
    e.preventDefault();
    if (!voucherFile) return;

    const file = voucherFile;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Por favor, sube una imagen válida (JPG, PNG o WebP). No se permiten otros tipos de archivos.');
      setUploading(false);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadResponse = await uploadAPI.uploadFile(voucherFile, 'image');
      await voucherAPI.create({
        course: id,
        voucher_image: uploadResponse.data.url,
      });

      setUploadSuccess(true);
      loadCourse();
    } catch (error) {
      console.error('Error al subir voucher:', error);
      const serverMsg = error.response?.data?.error || error.response?.data?.detail;
      const fieldErrors = error.response?.data && typeof error.response.data === 'object'
        ? Object.entries(error.response.data).map(([k, v]) => `${k}: ${v}`).join(', ')
        : null;
      const msg = serverMsg || fieldErrors || error.message || 'Error al subir el voucher. Intenta nuevamente.';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Curso no encontrado</h2>
          <Link to="/courses" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            Volver a cursos
          </Link>
        </div>
      </div>
    );
  }

  const isEnrolled = course.is_enrolled;
  const isApproved = course.enrollment_status?.is_approved;
  const canAccessContent = (isEnrolled && (isApproved || !course.is_paid)) || user?.role === 'teacher';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Botón de volver */}
          <button
            onClick={() => {
              if (user?.role === 'teacher') {
                navigate('/teacher/dashboard');
              } else {
                navigate('/student/dashboard');
              }
            }}
            className="mb-4 md:mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm md:text-base font-semibold"
          >
            <ArrowLeft size={18} />
            <span>Volver al Panel</span>
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 md:h-64 object-cover"
              />
            )}

            <div className="p-5 md:p-8">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 leading-tight">{course.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600 dark:text-gray-400 text-sm md:text-base">
                {user?.role === 'teacher' && (
                  <div className="flex items-center space-x-2">
                    <Users size={18} className="md:w-5 md:h-5" />
                    <span>{course.total_students} estudiantes</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <BookOpen size={18} className="md:w-5 md:h-5" />
                  <span>{course.total_lessons} lecciones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={18} className="md:w-5 md:h-5" />
                  <span>A tu ritmo</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">Descripción</h2>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{course.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t dark:border-gray-700 pt-5 md:pt-6 gap-4">
                <div>
                  <span className="text-2xl md:text-3xl font-bold text-primary-600">
                    {course.is_paid ? `S/ ${course.price}` : 'Gratis'}
                  </span>
                </div>
                <div className="w-full sm:w-auto">
                  {user?.role === 'teacher' ? (
                    <div className="flex items-center space-x-2 text-primary-600 justify-center">
                      <Users size={20} />
                      <span className="font-semibold">Vista de Profesor</span>
                    </div>
                  ) : !isEnrolled ? (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full sm:w-auto btn-primary disabled:opacity-50 py-3 px-8 text-sm md:text-base"
                    >
                      {enrolling ? 'Inscribiendo...' : 'Inscribirse Ahora'}
                    </button>
                  ) : !isApproved && course.is_paid ? (
                    <div className="flex items-center space-x-2 text-yellow-600 justify-center text-sm md:text-base">
                      <Clock size={18} className="md:w-5 md:h-5" />
                      <span className="font-semibold">Pago pendiente de aprobación</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-green-600 justify-center text-sm md:text-base">
                      <CheckCircle size={18} className="md:w-5 md:h-5" />
                      <span className="font-semibold">Inscrito</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 md:p-8 border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">Contenido del Curso</h2>
            {course.lessons.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <BookOpen size={40} className="md:w-12 md:h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg mb-2">
                  Este curso aún no tiene lecciones
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs md:text-sm">
                  El docente está preparando el contenido. Vuelve pronto.
                </p>
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 md:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                      <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm md:text-base">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">{lesson.title}</h3>
                        {lesson.description && (
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">{lesson.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="sm:ml-4">
                      {canAccessContent ? (
                        <Link
                          to={`/courses/${id}/lessons/${lesson.id}`}
                          className="w-full sm:w-auto inline-flex justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs md:text-sm font-bold shadow-sm">
                          Ver Lección
                        </Link>
                      ) : (
                        <div className="flex items-center sm:justify-center space-x-2 text-gray-400 dark:text-gray-600">
                          <Lock size={16} className="md:w-5 md:h-5" />
                          <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">Bloqueado</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showVoucherModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full p-6 md:p-10 border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {uploadSuccess ? '¡Todo listo!' : 'Inscripción al Curso'}
              </h3>
              <button
                onClick={() => {
                  setShowVoucherModal(false);
                  setUploadSuccess(false);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="text-center py-4 md:py-6 space-y-4 md:space-y-6">
                <div className="mx-auto flex items-center justify-center h-16 md:h-20 w-16 md:w-20 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                  <CheckCircle size={32} className="md:w-12 md:h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">¡Voucher Recibido!</h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Tu comprobante ha sido enviado correctamente. El docente lo revisará pronto para darte acceso al curso.
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 md:p-5 rounded-xl border border-blue-100 dark:border-blue-800 max-w-lg mx-auto text-left md:text-center">
                  <p className="text-xs md:text-sm text-blue-800 dark:text-blue-300">
                    <strong>¿Cómo sabré cuando esté aprobado?</strong> 🔔<br />
                    Te aparecerá una notificación automática en la pantalla principal apenas el docente valide tu pago.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowVoucherModal(false);
                    setUploadSuccess(false);
                  }}
                  className="w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold transition-all shadow-md transform hover:scale-105 text-sm md:text-base"
                >
                  Entendido, ¡gracias!
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Columna Izquierda: Info y QRs */}
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                    Estás a un paso de acceder a <strong>{course.title}</strong>.
                    Realiza el pago a través de Yape o Plin usando los QRs del docente.
                  </p>

                  {/* Códigos QR del Docente */}
                  {(course.teacher_yape_qr || course.teacher_plin_qr) ? (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {course.teacher_yape_qr && (
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">Yape Docente</p>
                          <div className="bg-white p-2 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                            <img src={course.teacher_yape_qr} alt="QR Yape Docente" className="w-full aspect-square object-contain" />
                          </div>
                        </div>
                      )}
                      {course.teacher_plin_qr && (
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">Plin Docente</p>
                          <div className="bg-white p-2 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                            <img src={course.teacher_plin_qr} alt="QR Plin Docente" className="w-full aspect-square object-contain" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl mb-6 text-center">
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed italic">
                        El docente aún no ha subido sus QRs. Por favor, contáctalo por WhatsApp para coordinar el pago.
                      </p>
                    </div>
                  )}

                  <p className="text-[10px] text-gray-500 dark:text-gray-500 italic">
                    * Una vez subido el voucher, el docente validará tu pago para darte acceso total al contenido.
                  </p>
                </div>

                {/* Columna Derecha: Acciones */}
                <div className="space-y-6">
                  <a
                    href={`https://wa.me/${course?.teacher_phone?.replace(/\D/g, '') || '51999574257'}?text=${encodeURIComponent(`Hola, estoy interesado en el curso "${course.title}" y deseo coordinar el pago.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-green-900/20 active:scale-[0.98] text-sm md:text-base mb-2"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Coordinar por WhatsApp</span>
                  </a>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                      <span className="px-3 bg-white dark:bg-gray-800 text-gray-400">O sube tu voucher</span>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-2">
                      <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={16} />
                      <p className="text-red-800 dark:text-red-200 text-xs font-medium leading-relaxed">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleVoucherUpload} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-widest px-1">
                        Imagen del Voucher (Foto/Captura)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setVoucherFile(e.target.files[0])}
                        className="block w-full text-xs text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-900 focus:outline-none file:mr-3 file:py-2.5 file:px-4 file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-primary-600 file:text-white hover:file:bg-primary-700 transition-all shadow-sm"
                        required
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center space-x-2 py-3 shadow-lg shadow-primary-600/20"
                      >
                        <Upload size={18} />
                        <span className="text-sm font-bold uppercase tracking-wider">{uploading ? 'Enviando...' : 'Registrar Pago'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowVoucherModal(false)}
                        className="sm:order-first px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-bold uppercase tracking-wider active:scale-[0.98]"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
