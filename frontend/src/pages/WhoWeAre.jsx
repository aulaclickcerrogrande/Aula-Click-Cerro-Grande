import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandTitle from '../components/BrandTitle';
import { Target, Eye, Shield, Users, Rocket, Award, ArrowRight, ArrowLeft } from 'lucide-react';

const WhoWeAre = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeImage, setActiveImage] = useState(1);
    const [isHovered, setIsHovered] = useState(false);

    // Cambio automático de imagen cada 5 segundos (se pausa al hacer hover)
    useEffect(() => {
        let interval;
        if (!isHovered) {
            interval = setInterval(() => {
                setActiveImage(prev => (prev === 1 ? 2 : 1));
            }, 4000);
        }
        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative">
            {/* Botón Volver */}
            <div className="sticky top-20 z-20 container mx-auto px-4 h-0 overflow-visible">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm md:ml-0"
                >
                    <ArrowLeft size={20} />
                    <span className="font-bold">Volver</span>
                </button>
            </div>
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 -z-10" />
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto animate-fade-in-up">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                            Impulsando el Futuro de <br /> <BrandTitle />
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            Aula Click Cerro Grande es más que una plataforma de cursos; es un puente hacia nuevas oportunidades, diseñado para potenciar el talento local con tecnología de vanguardia.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/register" className="btn-primary py-4 px-8 text-lg font-bold">
                                Únete gratis ahora
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Misión y Visión */}
            <section className="py-16 md:py-24 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                    <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6">
                            <Target className="text-primary-600 dark:text-primary-400" size={32} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Nuestra Misión</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                            Democratizar la educación digital de alta calidad en nuestra comunidad. En Aula Click Cerro Grande brindamos herramientas tecnológicas accesibles y efectivas que permiten a cada estudiante desarrollar su máximo potencial, sin barreras geográficas ni de tiempo.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                            <Eye className="text-blue-600 dark:text-blue-400" size={32} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Nuestra Visión</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                            Convertirnos en el ecosistema de aprendizaje digital referente de Aula Click Cerro Grande y sus alrededores, reconocidos por nuestra innovación constante, excelencia académica y el impacto positivo en la vida profesional de nuestros alumnos.
                        </p>
                    </div>
                </div>
            </section>

            {/* Valores */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 rounded-[2rem] md:rounded-[4rem] mx-4 overflow-hidden relative border border-gray-100 dark:border-gray-800">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/5 dark:bg-primary-600/10 blur-[100px] -z-10" />
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-black mb-16 italic text-gray-900 dark:text-white">Lo que nos mueve ⚡</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Rocket, title: "Innovación", desc: "Buscamos siempre las mejores tecnologías para tu aprendizaje." },
                            { icon: Shield, title: "Compromiso", desc: "Tu éxito es nuestro éxito. No te dejamos solo." },
                            { icon: Users, title: "Comunidad", desc: "Somos una familia que crece y aprende junta." },
                            { icon: Award, title: "Calidad", desc: "Material Premium seleccionado por expertos." }
                        ].map((v, i) => (
                            <div key={i} className="group p-8 text-center bg-white dark:bg-white/5 rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 border border-gray-100 dark:border-white/5">
                                <div className="w-16 h-16 bg-primary-50 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <v.icon size={32} className="text-primary-600 dark:text-primary-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{v.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sobre el Profe */}
            <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl mx-auto">
                        {/* Galería de Fotos Interactiva con Persistencia y Pausa */}
                        <div
                            className="w-full lg:w-1/2 relative"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <div className="relative h-[500px] md:h-[600px] w-full max-w-md mx-auto">
                                {/* Foto 1 (Principal) */}
                                <div
                                    onMouseEnter={() => setActiveImage(1)}
                                    className={`absolute top-0 left-0 w-4/5 aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800 transition-all duration-500 cursor-pointer group
                                        ${activeImage === 1 ? 'z-20 rotate-0 scale-105' : 'z-10 rotate-3 scale-100'}`}
                                >
                                    <img
                                        src="/luciano.jpg"
                                        alt="Dr. Luciano Perez Guevara"
                                        className={`w-full h-full object-cover transition-all duration-500 scale-125 ${activeImage === 1 ? 'rotate-0' : '-rotate-3'}`}
                                    />
                                </div>
                                {/* Foto 2 (Secundaria) */}
                                <div
                                    onMouseEnter={() => setActiveImage(2)}
                                    className={`absolute bottom-0 right-0 w-4/5 aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800 transition-all duration-500 cursor-pointer group
                                        ${activeImage === 2 ? 'z-20 rotate-0 scale-105' : 'z-0 -rotate-6 scale-100'}`}
                                >
                                    <img
                                        src="/luciano2.jpg"
                                        alt="Dr. Luciano Perez Guevara - Segunda Foto"
                                        className={`w-full h-full object-cover transition-all duration-500 scale-125 ${activeImage === 2 ? 'rotate-0' : 'rotate-6'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contenido de la Bio */}
                        <div className="w-full lg:w-1/2">
                            <span className="brand-dynamic font-bold uppercase tracking-widest text-sm mb-4 block italic">
                                El corazón de <BrandTitle text="Aula Click Cerro Grande" className="inline" />
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                                Dr. Luciano Perez Guevara
                            </h2>

                            <div className="space-y-6 text-gray-600 dark:text-gray-400">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <Award className="text-primary-600 flex-shrink-0" size={24} />
                                        <div>
                                            <span className="font-bold text-gray-900 dark:text-white block">Doctor en Educación</span>
                                            <span className="text-sm">Investigador Renacyt</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <Award className="text-primary-600 flex-shrink-0" size={24} />
                                        <div>
                                            <span className="font-bold text-gray-900 dark:text-white block">Magister en Gestión</span>
                                            <span className="text-sm text-xs">Especialidad Ciencias Biológicas</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-900/20">
                                    <p className="leading-relaxed italic">
                                        "Miembro de la Red Internacional de Innovación, Solidaridad y Sostenibilidad. Bachiller en Administración de Empresas y Egresado de la Escuela Internacional de Gerencia."
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Target className="text-primary-600" size={20} />
                                        <span>Ex-Especialista en el Ministerio de Educación</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Users className="text-primary-600" size={20} />
                                        <span>Ex-miembro del Comité Electoral UNFV</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Shield className="text-primary-600" size={20} />
                                        <span>Jefe de la Oficina de Responsabilidad Social Universitaria</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Rocket className="text-primary-600" size={20} />
                                        <span>Coordinador Módulo Innova Acacia UNFV</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm">
                                        Revisor Par Ciego de Artículos Científicos, Autor y Coautor de libros de investigación.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="pb-20 pt-10 px-4">
                <div className="container mx-auto max-w-5xl text-center bg-primary-600 rounded-[2.5rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />

                    {user ? (
                        <>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-8 relative z-10">
                                ¡Qué bueno verte de nuevo, <br /> {user.first_name || 'estudiante'}!
                            </h2>
                            <Link
                                to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                                className="inline-block bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-xl hover:scale-105 transition-transform relative z-10"
                            >
                                Ir a mi panel principal
                            </Link>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-8 relative z-10">
                                ¿Listo para transformar <br /> tu carrera?
                            </h2>
                            <Link to="/register" className="inline-block bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-xl hover:scale-105 transition-transform relative z-10">
                                ¡Registrarme gratis ahora!
                            </Link>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default WhoWeAre;
