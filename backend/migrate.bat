@echo off
echo ============================================================
echo Aplicando migraciones para PasswordReset...
echo ============================================================
echo.

call venv\Scripts\activate.bat
python manage.py migrate

echo.
echo ============================================================
if %ERRORLEVEL% EQU 0 (
    echo Migraciones aplicadas exitosamente!
    echo El sistema de recuperacion de contrasena esta ahora activo.
) else (
    echo Error al aplicar migraciones.
)
echo ============================================================
pause
