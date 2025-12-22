# 🚀 Inicio Rápido - Aula Click Cerro Grande

## ⚡ Para comenzar en 5 minutos

### 1️⃣ Copiar el Logo (IMPORTANTE)

Antes de comenzar, copia el logo institucional:

**Origen**: `C:\Users\HP\Documents\Logo cerro grande`
**Destino**: `C:\Users\HP\CascadeProjects\AulaClickCerroGrande\frontend\public\logo.png`

```bash
# Desde la carpeta del proyecto
mkdir frontend\public
copy "C:\Users\HP\Documents\Logo cerro grande" frontend\public\logo.png
```

### 2️⃣ Backend (Terminal 1)

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

**Al crear el superusuario**:
- Username: admin
- Email: lpgunfv@gmail.com
- Password: [tu contraseña segura]

**IMPORTANTE - Configurar como Docente**:
```bash
python manage.py shell
```
Dentro del shell:
```python
from core.models import User
user = User.objects.get(username='admin')
user.role = 'teacher'
user.save()
exit()
```

**Iniciar servidor**:
```bash
python manage.py runserver
```

✅ Backend corriendo en: http://localhost:8000

### 3️⃣ Frontend (Terminal 2)

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

✅ Frontend corriendo en: http://localhost:5173

## 🎯 Acceso Rápido

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin

## 👤 Credenciales de Prueba

### Docente (que acabas de crear)
- Username: admin
- Password: [tu contraseña]
- Acceso: http://localhost:5173/login

### Estudiante (crear desde el frontend)
- Ir a: http://localhost:5173/register
- Completar el formulario
- Automáticamente tendrá rol de estudiante

## 📝 Flujo de Prueba Rápido

1. **Login como Docente** → http://localhost:5173/login
2. **Crear un Curso** → Dashboard → "Crear Curso"
3. **Agregar Lecciones** → Editar curso → "Agregar Lección"
4. **Cerrar sesión**
5. **Registrar un Estudiante** → http://localhost:5173/register
6. **Inscribirse al curso** → Ver cursos → Inscribirse
7. **Ver lecciones** → Acceder al contenido

## 🎥 Configurar Video de YouTube

Para agregar videos a las lecciones:

1. Sube tu video a YouTube
2. Configura como "Oculto" (Unlisted)
3. Copia el ID del video:
   - URL: `https://youtube.com/watch?v=dQw4w9WgXcQ`
   - ID: `dQw4w9WgXcQ`
4. Pega el ID en el formulario de lección

## 💳 Probar Sistema de Pago

1. **Crear curso de pago** (Docente):
   - Marcar "Curso de Pago"
   - Establecer precio (ej: 50.00)

2. **Inscribirse** (Estudiante):
   - Ver el curso
   - Click en "Inscribirse"
   - Subir una imagen de voucher

3. **Aprobar** (Docente):
   - Ir a Dashboard
   - Ver "Vouchers Pendientes"
   - Aprobar el voucher

4. **Acceder** (Estudiante):
   - Recargar la página del curso
   - Ahora puedes ver las lecciones

## 🐛 Problemas Comunes

### Backend no inicia
```bash
# Verificar que el entorno virtual está activo
venv\Scripts\activate
# Reinstalar dependencias
pip install -r requirements.txt
```

### Frontend no inicia
```bash
# Limpiar caché
npm cache clean --force
# Reinstalar
rm -rf node_modules
npm install
```

### No se ve el logo
- Verificar que `frontend/public/logo.png` existe
- Recargar la página con Ctrl+F5

### Videos no se reproducen
- Verificar que el video esté en modo "Oculto"
- Verificar el ID del video
- Revisar consola del navegador (F12)

## 📞 ¿Necesitas ayuda?

- **WhatsApp**: +51 999 574 257
- **Email**: lpgunfv@gmail.com

---

¡Listo para enseñar! 🎓✨
