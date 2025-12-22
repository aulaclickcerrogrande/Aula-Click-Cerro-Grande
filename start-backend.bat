@echo off
echo Iniciando Backend de Aula Click Cerro Grande...
cd backend
call venv\Scripts\activate.bat
python manage.py runserver
