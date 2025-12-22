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

            <main className="ml-64 flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-100 mb-8 flex items-center">
                        <Users size={28} className="mr-3" />
                        Gestionar Estudiantes
                    </h1>

                    {/* Search Bar */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    {/* Students Table */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando estudiantes...</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <Users className="mx-auto text-gray-400 mb-4" size={64} />
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                                {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Los estudiantes aparecerán aquí cuando se registren'}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estudiante</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Teléfono</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cursos</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                            <User className="text-blue-600 dark:text-blue-400" size={20} />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {student.first_name} {student.middle_name} {student.last_name} {student.second_last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">@{student.username}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                                                        <Mail size={16} className="mr-2 text-gray-400" />
                                                        {student.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {student.phone || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                                                        <BookOpen size={16} className="mr-2 text-gray-400" />
                                                        {student.enrolled_courses_count || 0}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleViewCourses(student)}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                                                        title="Ver cursos"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(student)}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                                        title="Eliminar estudiante"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>


            {/* Courses Modal */}
            {showCoursesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                                <BookOpen size={20} className="mr-2" />
                                Cursos de {selectedStudent?.username}
                            </h3>
                            <button
                                onClick={() => setShowCoursesModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {loadingCourses ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando cursos...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Cursos Gratuitos */}
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-md text-sm mr-2">
                                            Gratuitos ({studentCourses.free.length})
                                        </span>
                                    </h4>
                                    {studentCourses.free.length > 0 ? (
                                        <div className="space-y-2">
                                            {studentCourses.free.map(course => (
                                                <div key={course.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group">
                                                    <BookOpen size={16} className="text-green-600 dark:text-green-400 mr-3" />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">{course.description?.substring(0, 50)}...</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleUnenroll(course.enrollmentId, course.title)}
                                                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                        title="Desinscribir del curso"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm italic">No tiene cursos gratuitos</p>
                                    )}
                                </div>

                                {/* Cursos de Pago */}
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-md text-sm mr-2">
                                            De Pago ({studentCourses.paid.length})
                                        </span>
                                    </h4>
                                    {studentCourses.paid.length > 0 ? (
                                        <div className="space-y-2">
                                            {studentCourses.paid.map(course => (
                                                <div key={course.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group">
                                                    <BookOpen size={16} className="text-blue-600 dark:text-blue-400 mr-3" />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">{course.description?.substring(0, 50)}...</p>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                            S/ {course.price}
                                                        </span>
                                                        <button
                                                            onClick={() => handleUnenroll(course.enrollmentId, course.title)}
                                                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                            title="Desinscribir del curso"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm italic">No tiene cursos de pago</p>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Total de cursos inscritos: <strong className="text-gray-900 dark:text-white">
                                            {studentCourses.free.length + studentCourses.paid.length}
                                        </strong>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
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
                            ¿Estás seguro que deseas eliminar al estudiante <strong>{selectedStudent?.username}</strong>? Esta acción no se puede deshacer.
                        </p>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Para confirmar, escribe <strong>ELIMINAR ESTUDIANTE</strong>
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
                                disabled={deleteConfirmText !== 'ELIMINAR ESTUDIANTE'}
                                className={`flex-1 px-4 py-2 rounded-md transition-colors ${deleteConfirmText === 'ELIMINAR ESTUDIANTE'
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
        </div>
    );
};

export default ManageStudents;
