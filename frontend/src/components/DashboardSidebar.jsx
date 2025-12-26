import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, BookOpen, Users, CheckCircle, XCircle, AlertCircle, Eye, Menu, X, Info, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { voucherAPI } from '../services/api';
import VoucherActionModal from './VoucherActionModal';

const DashboardSidebar = () => {
    const location = useLocation();
    const { user } = useAuth();
    const isTeacher = user?.role === 'teacher';
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [voucherConfirm, setVoucherConfirm] = useState({ show: false, id: null, action: null, notes: '' });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (isTeacher) {
            loadVouchers();
            window.addEventListener('voucher-processed', loadVouchers);
            return () => window.removeEventListener('voucher-processed', loadVouchers);
        }
    }, [isTeacher]);

    // Cerrar menú móvil cuando cambia la ruta
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const loadVouchers = async () => {
        setLoading(true);
        try {
            const response = await voucherAPI.getAll();
            setVouchers(response.data.filter(v => v.status === 'pending'));
        } catch (error) {
            console.error('Error al cargar vouchers en sidebar:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVoucherAction = (id, action) => {
        setVoucherConfirm({ show: true, id, action, notes: '' });
    };

    const confirmVoucherAction = async () => {
        const { id, action, notes } = voucherConfirm;
        try {
            if (action === 'approve') {
                await voucherAPI.approve(id, notes);
            } else {
                await voucherAPI.reject(id, notes);
            }
            setVoucherConfirm({ show: false, id: null, action: null, notes: '' });
            loadVouchers();
            window.dispatchEvent(new CustomEvent('voucher-processed'));
        } catch (error) {
            console.error('Error al procesar voucher:', error);
            alert('Error al procesar el voucher');
        }
    };

    const menuItems = [
        {
            icon: Home,
            label: 'Página principal',
            path: isTeacher ? '/teacher/dashboard' : '/student/dashboard',
            key: 'home'
        },
        ...(!isTeacher ? [{
            icon: BookOpen,
            label: 'Explorar Cursos',
            path: '/courses',
            key: 'courses'
        }] : []),
        ...(isTeacher ? [{
            icon: Users,
            label: 'Gestionar Estudiantes',
            path: '/teacher/students',
            key: 'students'
        }] : []),
        {
            icon: Settings,
            label: 'Configuración',
            path: '/settings',
            key: 'settings'
        },
    ];

    const isActive = (path) => {
        if (path === '#') return false;
        return location.pathname === path;
    };

    return (
        <>
            {/* Mobile Menu Button - Reposicionado a esquina inferior derecha */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 p-3 bg-primary-600 dark:bg-primary-500 text-white rounded-full shadow-2xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-all active:scale-95"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30 top-16"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
                h-[calc(100vh-4rem)] fixed left-0 top-16 z-40 overflow-y-auto
                transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col
            `}>
                <nav className="py-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <Link
                                key={item.key}
                                to={item.path}
                                className={`
                    flex items-center space-x-3 px-4 md:px-6 py-3 transition-colors
                    ${active
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-r-4 border-blue-700 dark:border-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }
                  `}
                            >
                                <Icon size={20} className={active ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'} />
                                <span className={`text-xs md:text-sm font-medium ${active ? 'font-semibold' : ''}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sección de Vouchers para Docentes */}
                {isTeacher && vouchers.length > 0 && (
                    <div className="mt-6 md:mt-8 px-3 md:px-4 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-3 md:mb-4 px-2">
                            <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                <AlertCircle size={12} className="mr-1 md:mr-2" />
                                Vouchers Pendientes
                            </h3>
                            <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full animate-pulse">
                                {vouchers.length}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 md:space-y-3 pb-6 max-h-96">
                            {loading && vouchers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 opacity-50">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mb-2"></div>
                                </div>
                            ) : (
                                vouchers.map((voucher) => (
                                    <div key={voucher.id} className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 md:p-3 hover:border-primary-500 dark:hover:border-primary-500 transition-all group">
                                        <div className="mb-2">
                                            <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 mb-0.5 truncate uppercase">
                                                {voucher.course_title}
                                            </p>
                                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                                                {voucher.student_name}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-2 md:mt-3 gap-1 md:gap-2">
                                            <a
                                                href={voucher.voucher_image}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1 md:p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 rounded-md border border-transparent hover:border-blue-200 transition-all"
                                                title="Ver comprobante"
                                            >
                                                <Eye size={14} className="md:w-4 md:h-4" />
                                            </a>

                                            <div className="flex items-center space-x-1">
                                                <button
                                                    onClick={() => handleVoucherAction(voucher.id, 'reject')}
                                                    className="p-1 md:p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                    title="Rechazar"
                                                >
                                                    <XCircle size={16} className="md:w-[18px] md:h-[18px]" />
                                                </button>
                                                <button
                                                    onClick={() => handleVoucherAction(voucher.id, 'approve')}
                                                    className="px-2 md:px-3 py-1 md:py-1.5 bg-green-600 hover:bg-green-700 text-white text-[9px] md:text-[10px] font-bold rounded-md transition-colors shadow-sm"
                                                >
                                                    Aprobar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                <VoucherActionModal
                    show={voucherConfirm.show}
                    action={voucherConfirm.action}
                    notes={voucherConfirm.notes}
                    onNotesChange={(val) => setVoucherConfirm(prev => ({ ...prev, notes: val }))}
                    onCancel={() => setVoucherConfirm({ show: false, id: null, action: null, notes: '' })}
                    onConfirm={confirmVoucherAction}
                />

                {/* Sección Inferior: Soporte e Institucional */}
                <div className="mt-auto border-t border-gray-100 dark:border-gray-700 p-4 space-y-2">
                    <Link
                        to="/nosotros"
                        className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all group"
                    >
                        <Info size={18} className="group-hover:text-primary-600 transition-colors" />
                        <span className="text-xs font-medium group-hover:text-gray-900 dark:group-hover:text-white">¿Quiénes somos?</span>
                    </Link>

                    <button
                        onClick={() => {
                            const message = encodeURIComponent('¡Hola Profe! Deseo realizar una consulta sobre Aula Click Cerro Grande.');
                            window.open(`https://wa.me/51912628464?text=${message}`, '_blank');
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-xl transition-all border border-primary-100 dark:border-primary-900/50 group"
                    >
                        <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold">Contactar con el docente</span>
                    </button>

                    <div className="pt-2 px-4">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium text-center">
                            Aula Click Cerro Grande v1.2
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default DashboardSidebar;
