# Aula Click Cerro Grande - Frontend

Frontend de la plataforma e-learning desarrollado con React + Vite + Tailwind CSS.

## Características

- 🎨 UI moderna y responsive con Tailwind CSS
- 🔐 Autenticación con JWT (Login/Register)
- 👨‍🎓 Dashboard de Estudiante con seguimiento de progreso
- 👨‍🏫 Dashboard de Docente para gestión de cursos
- 🎥 Reproductor de video seguro con YouTube API
- 🔒 Sistema de candado para cursos de pago
- 💳 Subida y aprobación de vouchers
- 📄 Visualización de documentos (PDF, DOCX, XLSX, PPTX)
- 🎵 Reproductor de audio integrado
- 📱 Botón flotante de WhatsApp

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

4. Construir para producción:
```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── components/         # Componentes reutilizables
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── WhatsAppButton.jsx
│   ├── SecureVideoPlayer.jsx
│   └── ProtectedRoute.jsx
├── context/           # Contextos de React
│   └── AuthContext.jsx
├── pages/             # Páginas de la aplicación
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── CoursesList.jsx
│   ├── CourseDetail.jsx
│   ├── LessonView.jsx
│   ├── StudentDashboard.jsx
│   ├── TeacherDashboard.jsx
│   ├── CourseForm.jsx
│   └── LessonForm.jsx
├── services/          # Servicios API
│   └── api.js
├── App.jsx           # Componente principal
├── main.jsx          # Punto de entrada
└── index.css         # Estilos globales
```

## Rutas de la Aplicación

### Públicas
- `/` - Página principal
- `/login` - Iniciar sesión
- `/register` - Registro de estudiantes

### Estudiantes
- `/student/dashboard` - Dashboard del estudiante
- `/courses` - Lista de cursos
- `/courses/:id` - Detalle de curso
- `/courses/:courseId/lessons/:lessonId` - Ver lección

### Docentes
- `/teacher/dashboard` - Dashboard del docente
- `/teacher/courses/new` - Crear curso
- `/teacher/courses/:id/edit` - Editar curso
- `/teacher/courses/:courseId/lessons/new` - Crear lección
- `/teacher/courses/:courseId/lessons/:lessonId/edit` - Editar lección

## Deployment en Hostinger

1. Construir el proyecto:
```bash
npm run build
```

2. Subir la carpeta `dist/` a Hostinger mediante FTP o File Manager

3. Configurar las variables de entorno en producción

4. Asegurarse de que el backend esté configurado con los CORS correctos
