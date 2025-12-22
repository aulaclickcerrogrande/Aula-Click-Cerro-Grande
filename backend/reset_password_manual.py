import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import User

# Solicitar email
email = input("Ingresa el email del usuario: ")

try:
    user = User.objects.get(email=email)
    print(f"\n✅ Usuario encontrado: {user.username}")
    print(f"Email: {user.email}")
    print(f"Password hash: {user.password[:50]}...")
    
    # Cambiar contraseña de prueba
    nueva = input("\n¿Quieres cambiar la contraseña? (s/n): ")
    if nueva.lower() == 's':
        password = input("Nueva contraseña: ")
        user.set_password(password)
        user.save()
        print(f"\n✅ Contraseña cambiada exitosamente para {user.email}")
        print(f"Nuevo hash: {user.password[:50]}...")
except User.DoesNotExist:
    print(f"\n❌ No se encontró usuario con email: {email}")
