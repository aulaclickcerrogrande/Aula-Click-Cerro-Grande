# 🚀 Guía de Deployment en Hostinger

Esta guía te ayudará a desplegar la plataforma Aula Click Cerro Grande en Hostinger.

## 📋 Pre-requisitos

1. Cuenta de Hostinger con acceso a:
   - Python/Node.js hosting
   - Base de datos (MySQL o PostgreSQL)
   - Acceso SSH (recomendado)
   - Gestión de dominios

2. Credenciales listas:
   - Cloudinary configurado
   - YouTube API Key activa

## 🗄️ Paso 1: Configurar Base de Datos

1. Crear base de datos en Hostinger:
   - Nombre: `aula_click_db`
   - Usuario: `aula_click_user`
   - Contraseña: [generar contraseña segura]

2. Guardar credenciales para el siguiente paso

## 🔧 Paso 2: Configurar Backend

### Opción A: Deployment con SSH

1. Conectar por SSH:
```bash
ssh usuario@tudominio.com
```

2. Clonar o subir el proyecto:
```bash
cd public_html
mkdir api
cd api
# Subir archivos del backend aquí
```

3. Crear entorno virtual:
```bash
python3 -m venv venv
source venv/bin/activate
```

4. Instalar dependencias:
```bash
pip install -r requirements.txt
```

5. Configurar variables de entorno:
```bash
nano .env
```

Agregar:
```env
SECRET_KEY=tu-clave-secreta-super-segura-cambiar-en-produccion
DEBUG=False
ALLOWED_HOSTS=tudominio.com,www.tudominio.com
DATABASE_URL=mysql://aula_click_user:password@localhost/aula_click_db
CLOUDINARY_CLOUD_NAME=db2luliqx
CLOUDINARY_API_KEY=331478513833428
CLOUDINARY_API_SECRET=pbvw4KBVXTp-uJDplg5SSyh8FX8
YOUTUBE_API_KEY=AIzaSyC0x35x32TeealsV6dvmSzL4ghNIKn_E1U
CORS_ALLOWED_ORIGINS=https://tudominio.com
FRONTEND_URL=https://tudominio.com
```

6. Ejecutar migraciones:
```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

7. Crear superusuario:
```bash
python manage.py createsuperuser
# Username: admin
# Email: lpgunfv@gmail.com
# Password: [contraseña segura]
```

**IMPORTANTE**: Después de crear el usuario, edita su rol:
```bash
python manage.py shell
```
```python
from core.models import User
user = User.objects.get(username='admin')
user.role = 'teacher'
user.save()
exit()
```

8. Configurar Gunicorn:
```bash
gunicorn config.wsgi:application --bind 127.0.0.1:8000 --daemon
```

### Opción B: Deployment con File Manager

1. Construir localmente y comprimir `backend/` en ZIP
2. Subir ZIP mediante File Manager de Hostinger
3. Descomprimir en `public_html/api/`
4. Configurar desde panel de control de Hostinger

## 🎨 Paso 3: Configurar Frontend

1. En tu PC local, actualizar `.env`:
```bash
cd frontend
nano .env
```

Configurar:
```env
VITE_API_URL=https://tudominio.com/api
VITE_YOUTUBE_API_KEY=AIzaSyC0x35x32TeealsV6dvmSzL4ghNIKn_E1U
```

2. Construir para producción:
```bash
npm run build
```

3. Subir contenido de `dist/` a Hostinger:
   - Vía FTP/SFTP a `public_html/`
   - O mediante File Manager

4. Crear archivo `.htaccess` en `public_html/`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/api
  RewriteRule . /index.html [L]
</IfModule>

# Configurar proxy para API
<IfModule mod_proxy.c>
  ProxyPass /api http://127.0.0.1:8000/api
  ProxyPassReverse /api http://127.0.0.1:8000/api
</IfModule>
```

## 🖼️ Paso 4: Subir Logo Institucional

1. En tu PC, copia el logo desde:
   `C:\Users\HP\Documents\Logo cerro grande`

2. Renómbralo a `logo.png`

3. Súbelo a `public_html/` en Hostinger junto con los demás archivos

## ✅ Paso 5: Verificación

1. **Verificar Backend**:
```bash
curl https://tudominio.com/api/
```

Deberías ver la respuesta de la API.

2. **Verificar Frontend**:
   - Visitar: https://tudominio.com
   - Verificar que el logo se muestre
   - Probar login/registro

3. **Verificar Funcionalidades**:
   - Login como docente ✓
   - Crear curso ✓
   - Crear lección ✓
   - Registro como estudiante ✓
   - Inscribirse en curso ✓
   - Ver lección con video ✓
   - Subir voucher ✓
   - Aprobar voucher (docente) ✓

## 🔒 Seguridad Post-Deployment

1. **Cambiar SECRET_KEY**:
```python
import secrets
print(secrets.token_urlsafe(50))
```

2. **Configurar SSL**:
   - Activar certificado SSL en Hostinger
   - Forzar HTTPS

3. **Configurar Firewall**:
   - Limitar acceso al puerto 8000
   - Solo permitir desde localhost

4. **Backups**:
   - Configurar backups automáticos de la base de datos
   - Backup semanal de archivos

## 🐛 Troubleshooting

### Error: 500 Internal Server Error
- Verificar logs: `tail -f error.log`
- Revisar permisos de archivos
- Verificar configuración de ALLOWED_HOSTS

### Error: CORS
- Verificar `CORS_ALLOWED_ORIGINS` en backend
- Asegurar que incluya el dominio exacto

### Error: Base de datos
- Verificar credenciales en .env
- Comprobar que la base de datos existe
- Revisar permisos del usuario

### Videos no se reproducen
- Verificar YouTube API Key
- Asegurar que los videos estén en modo "Unlisted"
- Revisar consola del navegador

## 📞 Soporte

Si encuentras problemas:
- **WhatsApp**: +51 999 574 257
- **Email**: lpgunfv@gmail.com

## 🎉 Post-Deployment

Una vez todo funcione:

1. **Anunciar en redes sociales**:
   - YouTube: @lucianoperez9423
   - TikTok: @pandanshe
   - Facebook: Luc Perez

2. **Crear primer curso de prueba**

3. **Invitar a estudiantes beta testers**

4. **Monitorear métricas y feedback**

---

¡Tu plataforma está lista para revolucionar la educación! 🚀📚
