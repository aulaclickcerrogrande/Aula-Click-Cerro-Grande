import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { Users, Search, Trash2, X, Mail, Phone, User, BookOpen, Eye } from 'lucide-react';
import { userAPI, enrollmentAPI } from '../services/api';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCoursesModal, setShowCoursesModal] = useState(false);
    const [studentCourses, setStudentCourses] = useState({ free: [], paid: [] });
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadStudents();
    }, []);

    useEffect(() => {
        filterStudents();
    }, [searchTerm, students]);

    const loadStudents = async () => {
        try {
            const response = await userAPI.getAll({ role: 'student' });
            setStudents(response.data);
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterStudents = () => {
        if (!searchTerm) {
            setFilteredStudents(students);
            return;
        }

        const filtered = students.filter(student =>
            student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStudents(filtered);
    };



    const handleDeleteClick = (student) => {
        setSelectedStudent(student);
        setDeleteConfirmText('');
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (deleteConfirmText !== 'ELIMINAR ESTUDIANTE') {
            alert('Debes escribir exactamente "ELIMINAR ESTUDIANTE" para confirmar');
            return;
        }

        try {
            await userAPI.delete(selectedStudent.id);
            alert('Estudiante eliminado exitosamente');
            setShowDeleteModal(false);
            setDeleteConfirmText('');
            loadStudents();
        } catch (error) {
            console.error('Error al eliminar estudiante:', error);
            alert('Error al eliminar el estudiante');
        }
    };

    const handleViewCourses = async (student) => {
        setSelectedStudent(student);
        setShowCoursesModal(true);
        setLoadingCourses(true);

        try {
            // Obtener cursos del estudiante
            const response = await userAPI.getById(student.id);
            const enrollments = response.data.enrollments || [];

            const free = enrollments
                .filter(e => !e.course.is_paid && e.is_approved)
                .map(e => ({ ...e.course, enrollmentId: e.id }));

            const paid = enrollments
                .filter(e => e.course.is_paid && e.is_approved)
                .map(e => ({ ...e.course, enrollmentId: e.id }));

            setStudentCourses({ free, paid });
        } catch (error) {
            console.error('Error al cargar cursos del estudiante:', error);
        } finally {
            setLoadingCourses(false);
        }
    };

    const handleUnenroll = async (enrollmentId, courseTitle) => {
        if (!window.confirm(`¿Estás seguro de que deseas desinscribir al estudiante del curso "${courseTitle}"?`)) {
            return;
        }

        try {
            await enrollmentAPI.delete(enrollmentId);
            // Recargar la lista de cursos del estudiante actual
            handleViewCourses(selectedStudent);
            // También recargar la lista general para actualizar contadores si es necesario
            loadStudents();
        } catch (error) {
            console.error('Error al desinscribir:', error);
            alert('Error al desinscribir al estudiante');
        }
    };

    return (
        <div className="flex min-h-screen bg-white dark:bg-gray-900">
            <DashboardSidebar />

            <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 md:mb-8 flex items-center">
                        <Users size={24} className="mr-3 text-primary-600" />
                        Gestionar Estudiantes
                    </h1>

                    {/* Search Bar */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 md:p-5 mb-6 shadow-sm">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base transition-all"
                            />
                        </div>
                    </div>

                    {/* Students Table */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent shadow-sm"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Cargando estudiantes...</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center py-12 md:py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm px-4">
                            <Users className="mx-auto text-gray-300 dark:text-gray-600 mb-6" size={64} />
                            <h3 className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                                {searchTerm ? 'No hay coincidencias' : 'No hay alumnos'}
                            </h3>
                            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                {searchTerm ? 'Prueba con otro nombre o correo electrónico' : 'Aún no se ha registrado ningún alumno en la plataforma'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Card view for mobile */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
                                {filteredStudents.map((student) => (
                                    <div key={student.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                                                <User size={24} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">
                                                    {student.first_name} {student.last_name}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{student.username}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-5">
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <Mail size={16} className="mr-2 text-gray-400" />
                                                <span className="truncate">{student.email}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <Phone size={16} className="mr-2 text-gray-400" />
                                                <span>{student.phone || 'Sin teléfono'}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <BookOpen size={16} className="mr-2 text-gray-400" />
                                                <span>{student.enrolled_courses_count || 0} cursos inscritos</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <button
                                                onClick={() => handleViewCourses(student)}
                                                className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider"
                                            >
                                                <Eye size={16} />
                                                <span>Ver Cursos</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(student)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Table view for desktop */}
                            <div className="hidden lg:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Estudiante</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Email</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Teléfono</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Cursos</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {filteredStudents.map((student) => (
                                                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                                                                <User size={20} />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                                    {student.first_name} {student.last_name}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">@{student.username}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                            <Mail size={16} className="mr-2 opacity-50" />
                                                            {student.email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                        {student.phone || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm font-bold text-gray-900 dark:text-gray-100">
                                                            <BookOpen size={16} className="mr-2 text-primary-500" />
                                                            {student.enrolled_courses_count || 0}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-3">
                                                            <button
                                                                onClick={() => handleViewCourses(student)}
                                                                className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                                                title="Ver cursos"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(student)}
                                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                title="Eliminar estudiante"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>


            {/* Courses Modal */}
            {showCoursesModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6 md:mb-8 sticky top-0 bg-white dark:bg-gray-800 pb-4 z-10 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-1">
                                    <BookOpen size={24} className="mr-3 text-primary-500" />
                                    Cursos del Alumno
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Gestionando a {selectedStudent?.first_name} (@{selectedStudent?.username})</p>
                            </div>
                            <button
                                onClick={() => setShowCoursesModal(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        {loadingCourses ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
                                <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Cargando inscripciones...</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Cursos Gratuitos */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Cursos Gratuitos</h4>
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-bold">
                                            {studentCourses.free.length} TOTAL
                                        </span>
                                    </div>
                                    {studentCourses.free.length > 0 ? (
                                        <div className="space-y-3">
                                            {studentCourses.free.map(course => (
                                                <div key={course.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 group hover:border-primary-200 transition-all">
                                                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm mr-4 flex-shrink-0">
                                                        <BookOpen size={20} className="text-green-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{course.title}</p>
                                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Inscrito Gratis</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleUnenroll(course.enrollmentId, course.title)}
                                                        className="p-2 text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                        title="Eliminar inscripción"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
                                            <p className="text-xs text-gray-400 italic">No tiene cursos gratuitos inscritos</p>
                                        </div>
                                    )}
                                </div>

                                {/* Cursos de Pago */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Cursos de Pago</h4>
                                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold">
                                            {studentCourses.paid.length} TOTAL
                                        </span>
                                    </div>
                                    {studentCourses.paid.length > 0 ? (
                                        <div className="space-y-3">
                                            {studentCourses.paid.map(course => (
                                                <div key={course.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 group hover:border-primary-200 transition-all">
                                                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm mr-4 flex-shrink-0">
                                                        <BookOpen size={20} className="text-blue-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{course.title}</p>
                                                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                                                            S/ {course.price} • PAGADO
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleUnenroll(course.enrollmentId, course.title)}
                                                        className="p-2 text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                        title="Eliminar inscripción"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
                                            <p className="text-xs text-gray-400 italic">No tiene cursos de pago inscritos</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Eliminar Estudiante</h3>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            ¿Estás seguro que deseas eliminar a <strong>{selectedStudent?.username}</strong>? Se perderán todos sus progresos y accesos. Esta acción <span className="text-red-500 font-bold underline">no se puede deshacer</span>.
                        </p>
                        <div className="mb-6">
                            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-widest px-1">
                                Confirma escribiendo: ELIMINAR ESTUDIANTE
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="Escribe aquí..."
                                className="w-full px-4 py-3 border border-red-100 dark:border-red-900/30 rounded-xl bg-red-50/30 dark:bg-red-900/10 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-bold"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleteConfirmText !== 'ELIMINAR ESTUDIANTE'}
                                className={`w-full sm:flex-1 py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg ${deleteConfirmText === 'ELIMINAR ESTUDIANTE'
                                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/20 active:scale-95'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmText('');
                                }}
                                className="w-full sm:flex-1 py-3.5 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold uppercase tracking-wider text-sm sm:order-first"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStudents;
