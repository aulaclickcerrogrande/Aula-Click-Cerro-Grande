# 🎓 Aula Click Cerro Grande

Plataforma e-learning completa desarrollada con Django REST Framework y React. Sistema profesional para gestionar cursos online con sistema de pago integrado mediante vouchers.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- Login y registro de estudiantes
- Login exclusivo para docentes (sin registro público)
- Autenticación JWT con refresh tokens
- Redirección automática según rol

### 👨‍🎓 Dashboard de Estudiante
- Visualización de cursos inscritos
- Seguimiento de progreso automático
- Sistema de lecciones completadas
- Acceso a materiales educativos

### 👨‍🏫 Dashboard de Docente
- Gestión completa de cursos
- Creación y edición de lecciones
- Aprobación de vouchers de pago
- Estadísticas de estudiantes

### 🎥 Reproductor de Video Seguro
- Integración con YouTube API
- Overlay anti-descarga
- Controles personalizados
- Guardado automático de progreso
- Videos en modo "Unlisted" (Oculto)

### 💳 Sistema de Pago con Vouchers
- Cursos gratuitos y de pago
- Subida de vouchers (Yape/Plin)
- Aprobación manual del docente
- Sistema de candado para contenido de pago

### 📚 Gestión de Contenido
- Videos de YouTube
- Documentos PDF, DOCX, XLSX, PPTX
- Archivos de audio MP3
- Visualización con Google Docs Viewer
- Subida directa a Cloudinary

### 🌐 Diseño Moderno
- UI responsive con Tailwind CSS
- Componentes inspirados en Classroom y Khan Academy
- Botón flotante de WhatsApp
- Footer con redes sociales
- Logo institucional integrado

## 🚀 Tecnologías

### Backend
- Django 4.2.7
- Django REST Framework
- JWT Authentication
- Cloudinary
- SQLite (desarrollo) / PostgreSQL (producción)

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router v6
- Axios
- Lucide Icons

## 📋 Requisitos Previos

- Python 3.9+
- Node.js 16+
- npm o yarn

## 🛠️ Instalación y Configuración

### Backend

1. Navegar a la carpeta backend:
```bash
cd backend
```

2. Crear entorno virtual:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno:
```bash
cp .env.example .env
```

5. Ejecutar migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Crear superusuario (Docente):
```bash
python manage.py createsuperuser
```
**Importante**: El primer usuario debe crearse con `role='teacher'` para acceso al panel docente.

7. Iniciar servidor de desarrollo:
```bash
python manage.py runserver
```

El backend estará disponible en: http://localhost:8000

### Frontend

1. Navegar a la carpeta frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Copiar el logo institucional:
- Copia el archivo de logo desde `C:\Users\HP\Documents\Logo cerro grande`
- Pégalo en `frontend/public/logo.png`

5. Iniciar servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en: http://localhost:5173

## 👤 Usuarios de Prueba

### Docente (Administrador)
- **Usuario**: Se crea con `python manage.py createsuperuser`
- **Rol**: teacher
- **Acceso**: Dashboard de docente, gestión de cursos

### Estudiante
- **Registro**: Disponible en `/register`
- **Rol**: student (automático)
- **Acceso**: Dashboard de estudiante, cursos

## 📱 Información de Contacto Integrada

- **WhatsApp**: +51 999 574 257
- **YouTube**: https://www.youtube.com/@lucianoperez9423
- **TikTok**: https://www.tiktok.com/@pandanshe
- **Facebook**: https://www.facebook.com/lucperezg/
- **Email**: lpgunfv@gmail.com

## 🔑 Credenciales de Cloudinary

```
Cloud name: db2luliqx
API Key: 331478513833428
API Secret: pbvw4KBVXTp-uJDplg5SSyh8FX8
```

## 🎬 YouTube API Key

```
AIzaSyC0x35x32TeealsV6dvmSzL4ghNIKn_E1U
```

## 📂 Estructura del Proyecto

```
AulaClickCerroGrande/
├── backend/                 # Django REST API
│   ├── config/             # Configuración Django
│   ├── core/               # App principal
│   │   ├── models.py       # Modelos (User, Course, Lesson, etc.)
│   │   ├── views.py        # Vistas API REST
│   │   ├── serializers.py  # Serializers DRF
│   │   ├── urls.py         # URLs de la API
│   │   └── admin.py        # Configuración Admin
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/               # React App
    ├── public/
    │   └── logo.png       # Logo institucional
    ├── src/
    │   ├── components/    # Componentes reutilizables
    │   ├── context/       # Context API
    │   ├── pages/         # Páginas
    │   ├── services/      # API services
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## 🚀 Deployment en Hostinger

### Backend (Django)

1. Configurar variables de entorno en producción:
```env
DEBUG=False
ALLOWED_HOSTS=tudominio.com
SECRET_KEY=tu-clave-secreta-segura
DATABASE_URL=postgresql://...
CORS_ALLOWED_ORIGINS=https://tudominio.com
```

2. Recolectar archivos estáticos:
```bash
python manage.py collectstatic --noinput
```

3. Configurar Gunicorn:
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

4. Usar supervisor o systemd para mantener el proceso activo

### Frontend (React)

1. Actualizar `.env` con URLs de producción:
```env
VITE_API_URL=https://api.tudominio.com/api
```

2. Construir para producción:
```bash
npm run build
```

3. Subir la carpeta `dist/` a Hostinger mediante:
   - FTP/SFTP
   - File Manager
   - Git deployment

4. Configurar reescritura de URLs para SPA:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 📝 Flujo de Uso

### Estudiante

1. **Registro**: Crear cuenta en `/register`
2. **Explorar**: Ver cursos disponibles en `/courses`
3. **Inscribirse**: Hacer clic en "Inscribirse" en un curso
   - Cursos gratuitos: Acceso inmediato
   - Cursos de pago: Subir voucher y esperar aprobación
4. **Aprender**: Ver lecciones, videos y materiales
5. **Progreso**: El sistema guarda automáticamente el avance

### Docente

1. **Login**: Iniciar sesión con cuenta de docente
2. **Crear Curso**: Ir a "Crear Curso" en el dashboard
3. **Configurar**: Establecer título, descripción, precio
4. **Agregar Lecciones**: Añadir videos, documentos y audios
5. **Aprobar Pagos**: Revisar y aprobar vouchers de estudiantes
6. **Monitorear**: Ver estadísticas y progreso de estudiantes

## 🔒 Seguridad Implementada

- ✅ Autenticación JWT con refresh tokens
- ✅ Protección de rutas por rol
- ✅ Overlay anti-descarga en videos
- ✅ Videos de YouTube en modo "Unlisted"
- ✅ Validación de permisos en el backend
- ✅ CORS configurado correctamente
- ✅ Sanitización de inputs

## 🎨 UI/UX Features

- ✅ Diseño responsive mobile-first
- ✅ Loading states y spinners
- ✅ Mensajes de error amigables
- ✅ Notificaciones de éxito
- ✅ Cards con hover effects
- ✅ Transiciones suaves
- ✅ Iconos de Lucide React

## 📄 Licencia

Proyecto desarrollado para Aula Click Cerro Grande.

## 👨‍💻 Soporte

Para consultas y soporte:
- **WhatsApp**: +51 999 574 257
- **Email**: lpgunfv@gmail.com

---

Desarrollado con ❤️ por Carpinchito Ronaldo Junior Vibe Coding
