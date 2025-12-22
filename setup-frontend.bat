@echo off
echo ========================================
echo  Aula Click Cerro Grande - Frontend Setup
echo ========================================
echo.

cd frontend

echo [1/3] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)

echo [2/3] Copiando archivo de configuracion...
if not exist .env (
    copy .env.example .env
    echo Archivo .env creado.
)

echo [3/3] Verificando logo...
if not exist public\logo.png (
    echo.
    echo ATENCION: No se encuentra el logo en public\logo.png
    echo Por favor copia el logo desde:
    echo   C:\Users\HP\Documents\Logo cerro grande
    echo Hacia:
    echo   %CD%\public\logo.png
    echo.
)

echo.
echo ========================================
echo  Setup completado!
echo ========================================
echo.
echo Para iniciar el servidor: npm run dev
echo El frontend estara disponible en: http://localhost:5173
echo ========================================
pause
