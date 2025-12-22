# Aula Click Cerro Grande - Backend API

Backend de la plataforma e-learning desarrollado con Django y Django REST Framework.

## Instalación

1. Crear entorno virtual:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Ejecutar migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Crear superusuario (Docente):
```bash
python manage.py createsuperuser
```

6. Ejecutar servidor:
```bash
python manage.py runserver
```

## API Endpoints

### Autenticación
- POST `/api/auth/register/` - Registro de estudiantes
- POST `/api/auth/login/` - Login
- POST `/api/auth/refresh/` - Refresh token
- GET `/api/auth/profile/` - Perfil del usuario
- PUT `/api/auth/profile/update/` - Actualizar perfil

### Cursos
- GET `/api/courses/` - Listar cursos
- POST `/api/courses/` - Crear curso (Teacher)
- GET `/api/courses/{id}/` - Detalle de curso
- PUT `/api/courses/{id}/` - Actualizar curso (Teacher)
- DELETE `/api/courses/{id}/` - Eliminar curso (Teacher)
- GET `/api/courses/my_courses/` - Mis cursos
- POST `/api/courses/{id}/enroll/` - Inscribirse en curso (Student)

### Lecciones
- GET `/api/lessons/?course={id}` - Listar lecciones por curso
- POST `/api/lessons/` - Crear lección (Teacher)
- GET `/api/lessons/{id}/` - Detalle de lección
- PUT `/api/lessons/{id}/` - Actualizar lección (Teacher)
- DELETE `/api/lessons/{id}/` - Eliminar lección (Teacher)
- POST `/api/lessons/{id}/update_progress/` - Actualizar progreso (Student)

### Inscripciones
- GET `/api/enrollments/` - Listar inscripciones
- POST `/api/enrollments/{id}/approve/` - Aprobar inscripción (Teacher)
- POST `/api/enrollments/{id}/reject/` - Rechazar inscripción (Teacher)

### Vouchers
- GET `/api/vouchers/` - Listar vouchers
- POST `/api/vouchers/` - Subir voucher (Student)
- POST `/api/vouchers/{id}/approve/` - Aprobar voucher (Teacher)
- POST `/api/vouchers/{id}/reject/` - Rechazar voucher (Teacher)

### Archivos
- POST `/api/upload/` - Subir archivos a Cloudinary

## Deployment en Hostinger

1. Configurar variables de entorno en producción
2. Ejecutar: `python manage.py collectstatic`
3. Usar Gunicorn como servidor WSGI
4. Configurar ALLOWED_HOSTS y CORS_ALLOWED_ORIGINS
