import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.management import call_command

print("Creando migraciones para el modelo PasswordReset...")
call_command('makemigrations', 'core')

print("\nAplicando migraciones...")
call_command('migrate')

print("\n✅ Migraciones completadas exitosamente!")
