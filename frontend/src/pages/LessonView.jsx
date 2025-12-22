import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lessonAPI, courseAPI } from '../services/api';
import SecureVideoPlayer from '../components/SecureVideoPlayer';
import { ArrowLeft, FileText, Music, Download, CheckCircle, ExternalLink } from 'lucide-react';

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessonData();
  }, [lessonId]);

  const loadLessonData = async () => {
    try {
      const [lessonRes, courseRes] = await Promise.all([
        lessonAPI.getById(lessonId),
        courseAPI.getById(courseId),
      ]);
      setLesson(lessonRes.data);
      setCourse(courseRes.data);
    } catch (error) {
      console.error('Error al cargar lección:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProgress = async (progressData) => {
    try {
      await lessonAPI.updateProgress(lessonId, progressData);
    } catch (error) {
      console.error('Error al actualizar progreso:', error);
    }
  };

  const getCloudinaryDownloadUrl = (url, fileName) => {
    if (!url) return '';
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      // Remover extensión del nombre si la tiene, Cloudinary la agrega
      const nameWithoutExt = fileName.split('.')[0];
      // Insertar fl_attachment con el nombre deseado
      return url.replace('/upload/', `/upload/fl_attachment:${nameWithoutExt}/`);
    }
    return url;
  };

  const handleDownload = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      // Fallback: abrir en nueva pestaña si falla el blob
      window.open(url, '_blank');
    }
  };

  const renderDocumentViewer = (url, type, index) => {
    let viewerUrl = '';
    let isDirectLink = false;

    if (type === 'pdf') {
      isDirectLink = true;
    } else if (type === 'xlsx') {
      viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
    } else {
      viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }

    const fileName = `Material_Clase_${index + 1}`;
    const downloadUrl = getCloudinaryDownloadUrl(url, fileName);

    return (
      <div key={`${type}-${index}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center space-x-2 text-gray-900 dark:text-gray-100">
            <FileText size={24} className="text-primary-600 dark:text-primary-400" />
            <span>Documento: {type.toUpperCase()} {index + 1}</span>
          </h3>
          <div className="flex space-x-2">
            {isDirectLink && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                <ExternalLink size={18} />
                <span>Abrir en nueva pestaña</span>
              </a>
            )}
          </div>
        </div>

        {isDirectLink ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
            <FileText size={64} className="text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6 max-w-md">
              Para visualizar este archivo PDF, haz clic en el botón de abajo para abrirlo en una nueva pestaña del navegador.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <ExternalLink size={18} />
              <span>Abrir PDF</span>
            </a>
          </div>
        ) : (
          <iframe
            src={viewerUrl}
            className="w-full h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
            title={`Documento ${type}`}
          ></iframe>
        )}
      </div>
    );
  };

  const renderAudioPlayer = (url) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors">
        <h3 className="text-xl font-bold flex items-center space-x-2 mb-4 text-gray-900 dark:text-gray-100">
          <Music size={24} className="text-primary-600 dark:text-primary-400" />
          <span>Audio de la Clase</span>
        </h3>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <audio controls className="w-full">
            <source src={url} type="audio/mpeg" />
            Tu navegador no soporta el elemento de audio.
          </audio>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lección no encontrada</h2>
          <Link to={`/courses/${courseId}`} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            Volver al curso
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = course.lessons.findIndex(l => l.id === lesson.id);
  const previousLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            to={`/courses/${courseId}`}
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-6 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver al curso</span>
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6 border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{lesson.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium">{course.title}</p>
            </div>

            {lesson.description && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{lesson.description}</p>
              </div>
            )}

            {lesson.progress && lesson.progress.is_completed && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2">
                <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                <span className="text-green-800 dark:text-green-300 font-semibold">Lección completada</span>
              </div>
            )}
          </div>

          {lesson.youtube_video_id && (
            <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
              <SecureVideoPlayer
                videoId={lesson.youtube_video_id}
                onProgress={handleProgress}
                initialTime={lesson.progress?.watched_duration || 0}
              />
            </div>
          )}

          {/* Renderizar archivos múltiples */}
          {lesson.pdf_files && lesson.pdf_files.map((url, index) => renderDocumentViewer(url, 'pdf', index))}
          {lesson.docx_files && lesson.docx_files.map((url, index) => renderDocumentViewer(url, 'docx', index))}
          {lesson.xlsx_files && lesson.xlsx_files.map((url, index) => renderDocumentViewer(url, 'xlsx', index))}
          {lesson.pptx_files && lesson.pptx_files.map((url, index) => renderDocumentViewer(url, 'pptx', index))}

          {/* Audio simple */}
          {lesson.audio_file && renderAudioPlayer(lesson.audio_file)}

          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors">
            {previousLesson ? (
              <Link
                to={`/courses/${courseId}/lessons/${previousLesson.id}`}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
              >
                <ArrowLeft size={20} />
                <span>Anterior</span>
              </Link>
            ) : (
              <div></div>
            )}

            {nextLesson ? (
              <Link
                to={`/courses/${courseId}/lessons/${nextLesson.id}`}
                className="flex items-center space-x-2 px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
              >
                <span>Siguiente</span>
                <ArrowLeft size={20} className="rotate-180" />
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;
