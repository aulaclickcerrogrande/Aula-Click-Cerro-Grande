# 📚 API Documentation - Aula Click Cerro Grande

Base URL: `http://localhost:8000/api`

## 🔐 Autenticación

Todas las rutas (excepto registro y login) requieren autenticación JWT.

**Header requerido**:
```
Authorization: Bearer <access_token>
```

### Registro (POST /auth/register/)
```json
{
  "username": "estudiante1",
  "email": "estudiante@example.com",
  "password": "password123",
  "password2": "password123",
  "first_name": "Juan",
  "last_name": "Pérez",
  "phone": "+51999999999",
  "role": "student"
}
```

**Response**:
```json
{
  "user": {
    "id": 1,
    "username": "estudiante1",
    "email": "estudiante@example.com",
    "role": "student"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Login (POST /auth/login/)
```json
{
  "username": "estudiante1",
  "password": "password123"
}
```

### Refresh Token (POST /auth/refresh/)
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## 👤 Usuario

### Obtener Perfil (GET /auth/profile/)
**Response**:
```json
{
  "id": 1,
  "username": "estudiante1",
  "email": "estudiante@example.com",
  "first_name": "Juan",
  "last_name": "Pérez",
  "role": "student",
  "phone": "+51999999999",
  "avatar": null,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Actualizar Perfil (PUT /auth/profile/update/)
```json
{
  "first_name": "Juan Carlos",
  "last_name": "Pérez López",
  "phone": "+51999888777",
  "avatar": "https://cloudinary.com/..."
}
```

## 📚 Cursos

### Listar Cursos (GET /courses/)
**Response**:
```json
[
  {
    "id": 1,
    "title": "Introducción a Python",
    "description": "Aprende Python desde cero",
    "thumbnail": "https://cloudinary.com/...",
    "teacher": 2,
    "teacher_name": "Prof. García",
    "is_paid": true,
    "price": "50.00",
    "is_published": true,
    "total_lessons": 10,
    "total_students": 25,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Obtener Curso (GET /courses/{id}/)
**Response**:
```json
{
  "id": 1,
  "title": "Introducción a Python",
  "description": "Aprende Python desde cero",
  "thumbnail": "https://cloudinary.com/...",
  "teacher": 2,
  "teacher_name": "Prof. García",
  "is_paid": true,
  "price": "50.00",
  "lessons": [
    {
      "id": 1,
      "title": "Variables y Tipos de Datos",
      "description": "Conceptos básicos",
      "order": 1,
      "youtube_video_id": "abc123",
      "video_duration": 600
    }
  ],
  "is_enrolled": true,
  "enrollment_status": {
    "is_approved": true,
    "enrolled_at": "2024-01-01T00:00:00Z"
  },
  "progress_percentage": 40.0
}
```

### Crear Curso (POST /courses/) [Teacher Only]
```json
{
  "title": "Django Avanzado",
  "description": "Desarrollo web profesional",
  "thumbnail": "https://cloudinary.com/...",
  "is_paid": false,
  "price": 0,
  "is_published": true
}
```

### Mis Cursos (GET /courses/my_courses/)
Retorna cursos del docente o cursos inscritos del estudiante.

### Inscribirse (POST /courses/{id}/enroll/) [Student Only]
**Response**:
```json
{
  "message": "Inscripción exitosa",
  "enrollment": {
    "id": 1,
    "student": 1,
    "course": 1,
    "is_approved": true,
    "enrolled_at": "2024-01-01T00:00:00Z"
  }
}
```

## 📖 Lecciones

### Listar Lecciones (GET /lessons/?course={course_id})
**Response**:
```json
[
  {
    "id": 1,
    "course": 1,
    "title": "Variables y Tipos de Datos",
    "description": "Conceptos básicos de Python",
    "order": 1,
    "youtube_video_id": "abc123",
    "video_duration": 600,
    "pdf_file": "https://cloudinary.com/...",
    "audio_file": null
  }
]
```

### Crear Lección (POST /lessons/) [Teacher Only]
```json
{
  "course": 1,
  "title": "Funciones en Python",
  "description": "Aprende a crear funciones",
  "order": 2,
  "youtube_video_id": "def456",
  "video_duration": 720,
  "pdf_file": "https://cloudinary.com/..."
}
```

### Actualizar Progreso (POST /lessons/{id}/update_progress/) [Student Only]
```json
{
  "watched_duration": 350,
  "is_completed": false
}
```

## 📝 Inscripciones

### Listar Inscripciones (GET /enrollments/)
Para docentes: inscripciones de sus cursos
Para estudiantes: sus propias inscripciones

### Aprobar Inscripción (POST /enrollments/{id}/approve/) [Teacher Only]
**Response**:
```json
{
  "message": "Inscripción aprobada",
  "enrollment": {
    "id": 1,
    "is_approved": true,
    "approved_at": "2024-01-01T00:00:00Z"
  }
}
```

## 💳 Vouchers

### Listar Vouchers (GET /vouchers/)
**Response**:
```json
[
  {
    "id": 1,
    "student": 1,
    "student_name": "Juan Pérez",
    "student_email": "juan@example.com",
    "course": 1,
    "course_title": "Introducción a Python",
    "voucher_image": "https://cloudinary.com/...",
    "status": "pending",
    "submitted_at": "2024-01-01T00:00:00Z"
  }
]
```

### Subir Voucher (POST /vouchers/) [Student Only]
```json
{
  "course": 1,
  "voucher_image": "https://cloudinary.com/..."
}
```

### Aprobar Voucher (POST /vouchers/{id}/approve/) [Teacher Only]
```json
{
  "notes": "Pago verificado correctamente"
}
```

**Response**:
```json
{
  "message": "Voucher aprobado y estudiante inscrito",
  "voucher": {
    "id": 1,
    "status": "approved",
    "reviewed_at": "2024-01-01T00:00:00Z",
    "reviewed_by": 2,
    "reviewed_by_name": "Prof. García"
  }
}
```

### Rechazar Voucher (POST /vouchers/{id}/reject/) [Teacher Only]
```json
{
  "notes": "Voucher ilegible, por favor sube una imagen más clara"
}
```

## 📤 Subida de Archivos

### Subir Archivo (POST /upload/)
**Content-Type**: `multipart/form-data`

**Form Data**:
- `file`: archivo a subir
- `type`: 'image' | 'video' | 'audio' | 'auto'

**Response**:
```json
{
  "url": "https://res.cloudinary.com/...",
  "public_id": "aula_click/images/abc123"
}
```

## 🔍 Códigos de Estado

- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos inválidos
- `401 Unauthorized`: No autenticado o token inválido
- `403 Forbidden`: Sin permisos para esta acción
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

## 🛡️ Permisos por Rol

### Student
- ✅ Ver cursos y lecciones
- ✅ Inscribirse en cursos
- ✅ Subir vouchers
- ✅ Ver su progreso
- ❌ Crear/editar cursos
- ❌ Aprobar vouchers

### Teacher
- ✅ Crear y editar cursos
- ✅ Crear y editar lecciones
- ✅ Aprobar vouchers
- ✅ Ver estadísticas
- ✅ Gestionar inscripciones
- ❌ Inscribirse como estudiante

## 🧪 Testing con cURL

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Obtener cursos (con token)
curl -X GET http://localhost:8000/api/courses/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."

# Crear curso
curl -X POST http://localhost:8000/api/courses/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"title":"Nuevo Curso","description":"Descripción","is_paid":false}'
```

---

Para más información, contactar: lpgunfv@gmail.com
