import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { lessonAPI, uploadAPI } from '../services/api';
import { Upload, Save, Youtube, FileText, Music, X, CheckCircle, RefreshCw, Eye } from 'lucide-react';
import SecureVideoPlayer from '../components/SecureVideoPlayer';

const LessonForm = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(lessonId);

  const [formData, setFormData] = useState({
    course: courseId,
    title: '',
    description: '',
    order: 0,
    youtube_video_id: '',
    video_duration: 0,
    pdf_files: [],
    docx_files: [],
    xlsx_files: [],
    pptx_files: [],
    audio_file: '',
  });

  const [uploading, setUploading] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewModal, setPreviewModal] = useState({ show: false, url: '', type: '' });

  useEffect(() => {
    if (isEdit) {
      loadLesson();
    }
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      const response = await lessonAPI.getById(lessonId);
      setFormData(response.data);
    } catch (error) {
      console.error('Error al cargar lección:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = async (e, fieldName, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading({ ...uploading, [fieldName]: true });
    try {
      const response = await uploadAPI.uploadFile(file, fileType);

      // Handle array fields vs singular fields
      if (fieldName === 'audio_file') {
        setFormData({ ...formData, [fieldName]: response.data.url });
      } else {
        // Add file to array for document fields
        const currentFiles = formData[fieldName] || [];
        setFormData({ ...formData, [fieldName]: [...currentFiles, response.data.url] });
      }
    } catch (error) {
      console.error('Error al subir archivo:', error);
      alert('Error al subir el archivo');
    } finally {
      setUploading({ ...uploading, [fieldName]: false });
    }
  };

  const handleRemoveFile = (fieldName, index) => {
    if (!window.confirm('¿Estás seguro que deseas eliminar este archivo?')) {
      return;
    }
    const currentFiles = formData[fieldName] || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    setFormData({ ...formData, [fieldName]: newFiles });
  };

  const handlePreview = (url, type) => {
    setPreviewModal({ show: true, url, type });
  };

  const closePreview = () => {
    setPreviewModal({ show: false, url: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      ...formData,
      audio_file: formData.audio_file || null,
      pdf_files: formData.pdf_files || [],
      docx_files: formData.docx_files || [],
      xlsx_files: formData.xlsx_files || [],
      pptx_files: formData.pptx_files || [],
    };

    try {
      if (isEdit) {
        await lessonAPI.update(lessonId, dataToSend);
        alert('Lección actualizada exitosamente');
      } else {
        await lessonAPI.create(dataToSend);
        alert('Lección creada exitosamente');
      }
      navigate(`/teacher/courses/${courseId}/edit`);
    } catch (error) {
      console.error('Error al guardar lección:', error);
      const errorMessage = error.response?.data
        ? Object.entries(error.response.data).map(([key, value]) => `${key}: ${value}`).join('\n')
        : 'Error al guardar la lección';
      alert(`Error: \n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {isEdit ? 'Editar Lección' : 'Crear Nueva Lección'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit ? 'Actualiza la información de tu lección' : 'Agrega contenido educativo a tu curso'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Título de la Lección *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Ej: Introducción a Variables"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="input-field"
              placeholder="Describe brevemente el contenido de esta lección..."
            ></textarea>
          </div>



          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Youtube className="text-red-600" size={24} />
              <span>Video de YouTube</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Enlace del Video de YouTube
                </label>
                <input
                  type="text"
                  name="youtube_video_id"
                  value={formData.youtube_video_id}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Copia y pega el enlace completo del video desde tu navegador.
                </p>
              </div>

              {formData.youtube_video_id && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Vista Previa del Video:</p>
                  <div className="max-w-md">
                    <SecureVideoPlayer videoId={formData.youtube_video_id} />
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <FileText className="text-blue-600" size={24} />
              <span>Documentos</span>
            </h3>
            <div className="space-y-4">


              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Archivos Word (DOCX)
                </label>
                <div className="space-y-2">
                  {formData.docx_files?.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                      <span className="flex-1 text-sm text-green-700 dark:text-green-300">DOCX {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handlePreview(file, 'docx')}
                        className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                        title="Vista previa"
                      >
                        <Eye size={18} className="text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('docx_files', index)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                      >
                        <X size={18} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  ))}
                  <label className="cursor-pointer">
                    <div className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                      <Upload size={18} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{uploading.docx_files ? 'Subiendo...' : 'Subir DOCX'}</span>
                    </div>
                    <input
                      type="file"
                      accept=".docx"
                      onChange={(e) => handleFileUpload(e, 'docx_files', 'auto')}
                      className="hidden"
                      disabled={uploading.docx_files}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Archivos Excel (XLSX)
                </label>
                <div className="space-y-2">
                  {formData.xlsx_files?.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                      <span className="flex-1 text-sm text-green-700 dark:text-green-300">XLSX {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handlePreview(file, 'xlsx')}
                        className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                        title="Vista previa"
                      >
                        <Eye size={18} className="text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('xlsx_files', index)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                      >
                        <X size={18} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  ))}
                  <label className="cursor-pointer">
                    <div className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                      <Upload size={18} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{uploading.xlsx_files ? 'Subiendo...' : 'Subir XLSX'}</span>
                    </div>
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={(e) => handleFileUpload(e, 'xlsx_files', 'auto')}
                      className="hidden"
                      disabled={uploading.xlsx_files}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Presentaciones PowerPoint (PPTX)
                </label>
                <div className="space-y-2">
                  {formData.pptx_files?.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                      <span className="flex-1 text-sm text-green-700 dark:text-green-300">PPTX {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handlePreview(file, 'pptx')}
                        className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                        title="Vista previa"
                      >
                        <Eye size={18} className="text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('pptx_files', index)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                      >
                        <X size={18} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  ))}
                  <label className="cursor-pointer">
                    <div className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                      <Upload size={18} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{uploading.pptx_files ? 'Subiendo...' : 'Subir PPTX'}</span>
                    </div>
                    <input
                      type="file"
                      accept=".pptx"
                      onChange={(e) => handleFileUpload(e, 'pptx_files', 'auto')}
                      className="hidden"
                      disabled={uploading.pptx_files}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Music className="text-purple-600" size={24} />
              <span>Audio</span>
            </h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Archivo de Audio (MP3)
              </label>
              {formData.audio_file ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                    <audio controls className="flex-1">
                      <source src={formData.audio_file} type="audio/mpeg" />
                    </audio>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('¿Estás seguro que deseas eliminar este archivo de audio?')) {
                          setFormData({ ...formData, audio_file: '' });
                        }
                      }}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                    >
                      <X size={18} className="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                    <Upload size={18} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{uploading.audio_file ? 'Subiendo...' : 'Subir MP3'}</span>
                  </div>
                  <input
                    type="file"
                    accept=".mp3,audio/*"
                    onChange={(e) => handleFileUpload(e, 'audio_file', 'audio')}
                    className="hidden"
                    disabled={uploading.audio_file}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={loading || Object.values(uploading).some(v => v)}
              className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Save size={20} />
              <span>{loading ? 'Guardando...' : isEdit ? 'Actualizar Lección' : 'Crear Lección'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(`/teacher/courses/${courseId}/edit`)}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form >
      </div >

      {/* Modal de Vista Previa */}
      {previewModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closePreview}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Vista Previa - {previewModal.type.toUpperCase()}
              </h3>
              <button onClick={closePreview} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X size={24} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-auto p-4">
              {previewModal.type === 'pdf' && (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <FileText size={64} className="text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    Para ver el PDF, haz clic en el botón de abajo para abrirlo en una nueva pestaña
                  </p>
                  <a
                    href={previewModal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <Upload size={18} />
                    <span>Abrir PDF en nueva pestaña</span>
                  </a>
                </div>
              )}
              {previewModal.type === 'xlsx' && (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewModal.url)}`}
                  className="w-full h-full border-0 rounded-lg"
                  title="Vista previa XLSX"
                />
              )}
              {(previewModal.type === 'docx' || previewModal.type === 'pptx') && (
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewModal.url)}&embedded=true`}
                  className="w-full h-full border-0 rounded-lg"
                  title={`Vista previa ${previewModal.type.toUpperCase()}`}
                />
              )}
              {previewModal.type === 'audio' && (
                <div className="flex items-center justify-center h-full">
                  <audio controls className="w-full max-w-2xl">
                    <source src={previewModal.url} />
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default LessonForm;
