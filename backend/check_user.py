import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import User

# Buscar el usuario chesucito@gmail.com
try:
    user = User.objects.get(email='chesucito@gmail.com')
    print("\n" + "="*60)
    print("📋 INFORMACIÓN COMPLETA DEL USUARIO")
    print("="*60)
    print(f"Email: {user.email}")
    print(f"Primer Nombre: {user.first_name}")
    print(f"Segundo Nombre: '{user.middle_name}'")
    print(f"Primer Apellido: {user.last_name}")
    print(f"Segundo Apellido: '{user.second_last_name}'")
    print(f"Teléfono: {user.phone}")
    print("="*60 + "\n")
except User.DoesNotExist:
    print("❌ Usuario no encontrado")
