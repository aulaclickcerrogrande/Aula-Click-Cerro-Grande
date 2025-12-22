@echo off
echo Activando entorno virtual...
call venv\Scripts\activate.bat

echo.
echo Aplicando migraciones...
python manage.py migrate

echo.
echo Migraciones completadas!
pause
