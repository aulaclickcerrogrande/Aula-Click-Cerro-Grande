@echo off
echo ========================================
echo  Aula Click Cerro Grande - Backend Setup
echo ========================================
echo.

cd backend

echo [1/6] Creando entorno virtual...
python -m venv venv
if errorlevel 1 (
    echo ERROR: No se pudo crear el entorno virtual
    pause
    exit /b 1
)

echo [2/6] Activando entorno virtual...
call venv\Scripts\activate.bat

echo [3/6] Instalando dependencias...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)

echo [4/6] Copiando archivo de configuracion...
if not exist .env (
    copy .env.example .env
    echo Archivo .env creado. Puedes editarlo si necesitas cambiar configuraciones.
)

echo [5/6] Ejecutando migraciones...
python manage.py makemigrations
python manage.py migrate

echo [6/6] Setup completado!
echo.
echo ========================================
echo  SIGUIENTE PASO: Crear superusuario
echo ========================================
echo.
echo Ejecuta: python manage.py createsuperuser
echo.
echo Luego en el shell de Python:
echo   python manage.py shell
echo   from core.models import User
echo   user = User.objects.get(username='tu_usuario')
echo   user.role = 'teacher'
echo   user.save()
echo   exit()
echo.
echo Para iniciar el servidor: python manage.py runserver
echo ========================================
pause
