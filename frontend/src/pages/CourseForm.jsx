import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseAPI, lessonAPI, uploadAPI } from '../services/api';
import { Upload, Plus, Trash2, Save, Image as ImageIcon, Youtube, FileText, Music, ArrowLeft, X } from 'lucide-react';

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    is_paid: false,
    price: 0,
    is_published: true,
  });

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadCourse();
    }
  }, [id]);

  const loadCourse = async () => {
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        courseAPI.getById(id),
        lessonAPI.getAll(id),
      ]);
      setFormData(courseRes.data);
      setLessons(lessonsRes.data);
    } catch (error) {
      console.error('Error al cargar curso:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadAPI.uploadFile(file, 'image');
      setFormData({ ...formData, thumbnail: response.data.url });
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (isEdit) {
      setShowUpdateModal(true);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (isEdit) {
        await courseAPI.update(id, formData);
        alert('Curso actualizado exitosamente');
        setShowUpdateModal(false);
      } else {
        const response = await courseAPI.create(formData);
        alert('Curso creado exitosamente');
        navigate(`/teacher/courses/${response.data.id}/edit`);
      }
    } catch (error) {
      console.error('Error al guardar curso:', error);
      alert('Error al guardar el curso');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = () => {
    navigate(`/teacher/courses/${id}/lessons/new`);
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('¿Estás seguro de eliminar esta lección?')) return;

    try {
      await lessonAPI.delete(lessonId);
      setLessons(lessons.filter(l => l.id !== lessonId));
      alert('Lección eliminada');
    } catch (error) {
      console.error('Error al eliminar lección:', error);
      alert('Error al eliminar la lección');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver a la pantalla principal</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {isEdit ? 'Editar Curso' : 'Crear Nuevo Curso'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Actualiza la información de tu curso' : 'Completa los datos para crear un nuevo curso'}
          </p>
        </div>

        <form onSubmit={handleSubmitClick} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Título del Curso *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Ej: Introducción a la Programación"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="input-field"
                placeholder="Describe tu curso..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Imagen de Portada
              </label>
              <div className="flex items-center space-x-4">
                {formData.thumbnail && (
                  <img
                    src={formData.thumbnail}
                    alt="Thumbnail"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                    <Upload size={20} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {uploading ? 'Subiendo...' : 'Subir Imagen'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_paid"
                    checked={formData.is_paid}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Curso de Pago
                  </span>
                </label>
              </div>

              {formData.is_paid && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Precio (S/)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Publicar Curso (visible para estudiantes)
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full btn-primary disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Save size={20} />
              <span>{loading ? 'Guardando...' : isEdit ? 'Actualizar Curso' : 'Crear Curso'}</span>
            </button>
          </div>
        </form>

        {isEdit && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lecciones del Curso</h2>
              <button
                onClick={handleAddLesson}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Agregar Lección</span>
              </button>
            </div>

            {lessons.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FileText className="mx-auto mb-3" size={48} />
                <p>No hay lecciones aún. Agrega la primera lección.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{lesson.title}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {lesson.youtube_video_id && (
                            <span className="flex items-center space-x-1">
                              <Youtube size={14} />
                              <span>Video</span>
                            </span>
                          )}
                          {lesson.pdf_file && (
                            <span className="flex items-center space-x-1">
                              <FileText size={14} />
                              <span>PDF</span>
                            </span>
                          )}
                          {lesson.audio_file && (
                            <span className="flex items-center space-x-1">
                              <Music size={14} />
                              <span>Audio</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/teacher/courses/${id}/lessons/${lesson.id}/edit`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Update Confirmation Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Confirmar Actualización</h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              ¿Estás seguro que deseas actualizar el curso <strong>"{formData.title}"</strong>?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Save size={18} />
                <span>Confirmar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseForm;
