# ⚡ Guía de Inicio Rápido - Aula Click Cerro Grande

## 🎯 Objetivo
Tener la plataforma funcionando en tu computadora en menos de 10 minutos.

## 📋 Requisitos
- Python 3.9 o superior
- Node.js 16 o superior
- El logo institucional en `C:\Users\HP\Documents\Logo cerro grande`

## 🚀 Paso a Paso

### Paso 1: Copiar el Logo 🖼️
```bash
# Opción A: Manualmente
1. Abre: C:\Users\HP\Documents\Logo cerro grande
2. Copia el archivo
3. Pega en: C:\Users\HP\CascadeProjects\AulaClickCerroGrande\frontend\public\
4. Renombra a: logo.png

# Opción B: Con comando (desde la carpeta del proyecto)
mkdir frontend\public
copy "C:\Users\HP\Documents\Logo cerro grande" frontend\public\logo.png
```

### Paso 2: Configurar Backend ⚙️

**Opción Automática (Recomendado)**:
```bash
# Doble click en:
setup-backend.bat

# Luego crear el superusuario docente:
cd backend
venv\Scripts\activate
python manage.py createsuperuser
```

**Crear usuario docente**:
Después de crear el superusuario, ejecuta:
```bash
python manage.py shell
```
Dentro del shell:
```python
from core.models import User
user = User.objects.get(username='tu_usuario')  # Reemplaza con tu username
user.role = 'teacher'
user.save()
exit()
```

### Paso 3: Configurar Frontend 🎨

**Opción Automática**:
```bash
# Doble click en:
setup-frontend.bat
```

### Paso 4: Iniciar Servidores 🚀

**Terminal 1 - Backend**:
```bash
# Doble click en: start-backend.bat
# O manualmente:
cd backend
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 - Frontend**:
```bash
# Doble click en: start-frontend.bat
# O manualmente:
cd frontend
npm run dev
```

## 🌐 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Aplicación principal |
| **Backend API** | http://localhost:8000/api | API REST |
| **Admin Django** | http://localhost:8000/admin | Panel administrativo |

## 👤 Primera Vez

### 1. Login como Docente
```
URL: http://localhost:5173/login
Usuario: [el que creaste]
Password: [tu contraseña]
```

### 2. Crear tu Primer Curso
```
Dashboard → "Crear Curso"
- Título: Introducción a la Programación
- Descripción: Aprende a programar desde cero
- Tipo: Gratis (para probar)
- Publicar: ✓
```

### 3. Agregar una Lección
```
Editar Curso → "Agregar Lección"
- Título: Variables y Tipos de Datos
- Video YouTube ID: dQw4w9WgXcQ (ejemplo)
- Guardar
```

### 4. Probar como Estudiante
```
1. Cerrar sesión
2. Ir a: http://localhost:5173/register
3. Registrarse con otro usuario
4. Explorar cursos
5. Inscribirse al curso
6. Ver la lección
```

## 📝 IDs de YouTube - Cómo Obtenerlos

Para agregar videos a tus lecciones:

**Paso 1**: Sube tu video a YouTube y configúralo como "Oculto" (Unlisted)

**Paso 2**: Copia el ID del video:
```
URL completa: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                              ↓↓↓↓↓↓↓↓↓↓↓
ID del video:                                dQw4w9WgXcQ
```

**Paso 3**: Pega solo el ID en el formulario de lección

## 💳 Probar Sistema de Pago

### Como Docente:
```
1. Crear curso nuevo
2. Marcar "Curso de Pago"
3. Establecer precio: 50.00
4. Guardar
```

### Como Estudiante:
```
1. Ver el curso de pago
2. Click "Inscribirse"
3. Subir imagen de voucher (cualquier imagen PNG/JPG)
4. Esperar aprobación
```

### Aprobar el Pago:
```
1. Login como docente
2. Dashboard → "Vouchers Pendientes"
3. Ver voucher
4. Click "Aprobar"
5. El estudiante ya puede acceder al contenido
```

## 🎥 Tipos de Contenido Soportados

| Tipo | Formato | Uso |
|------|---------|-----|
| Video | YouTube ID | Lecciones en video |
| PDF | .pdf | Documentos, guías |
| Word | .docx | Documentos editables |
| Excel | .xlsx | Hojas de cálculo |
| PowerPoint | .pptx | Presentaciones |
| Audio | .mp3 | Podcasts, audiolibros |

## 🔧 Solución de Problemas

### ❌ Error: "No module named 'django'"
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### ❌ Error: "npm: command not found"
```bash
# Instala Node.js desde: https://nodejs.org/
```

### ❌ El logo no aparece
```bash
# Verifica que exista:
dir frontend\public\logo.png

# Si no existe, cópialo desde:
copy "C:\Users\HP\Documents\Logo cerro grande" frontend\public\logo.png
```

### ❌ Videos no se reproducen
```
1. Verifica que el video esté en YouTube
2. Asegúrate de que esté configurado como "Oculto" (Unlisted)
3. Copia solo el ID, no la URL completa
4. Revisa la consola del navegador (F12) para ver errores
```

### ❌ Error: "Port 8000 already in use"
```bash
# Detén el proceso anterior:
# Windows: Ctrl+C en la terminal
# O cierra la terminal y abre una nueva
```

## 📱 Contacto y Redes

Todo está configurado automáticamente en el footer:
- **WhatsApp**: +51 999 574 257 (botón flotante incluido)
- **YouTube**: @lucianoperez9423
- **TikTok**: @pandanshe
- **Facebook**: Luc Perez
- **Email**: lpgunfv@gmail.com

## 🎓 Siguientes Pasos

1. ✅ Crear varios cursos de prueba
2. ✅ Agregar contenido multimedia variado
3. ✅ Probar el flujo completo de pago
4. ✅ Invitar a beta testers
5. ✅ Preparar para deployment en Hostinger (ver DEPLOYMENT.md)

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. Revisa esta guía paso a paso
2. Consulta el README.md principal
3. Revisa API_DOCUMENTATION.md
4. Contacta por WhatsApp: +51 999 574 257

---

**¡Listo para revolucionar la educación online! 🚀🎓**
