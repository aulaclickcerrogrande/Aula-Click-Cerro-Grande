import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import User

# Datos del docente
email = 'lpgunfv@gmail.com'
first_name = 'Luciano'
last_name = 'Perez'
username = 'Luciano Perez'
password = 'AulaClick2025!Docente'
phone = '+51999574257'

# Verificar si ya existe
if User.objects.filter(email=email).exists():
    print(f"❌ Ya existe un usuario con el email {email}")
    user = User.objects.get(email=email)
    print(f"   Usuario existente: {user.username} - {user.role}")
else:
    # Crear usuario docente
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        middle_name='',
        second_last_name='',
        role='teacher',
        phone=phone,
        is_staff=True,  # Acceso al admin de Django
    )
    
    print("✅ Usuario docente creado exitosamente!")
    print(f"   Email: {email}")
    print(f"   Username: {username}")
    print(f"   Contraseña: {password}")
    print(f"   Rol: {user.role}")
    print(f"\n🔐 GUARDA ESTA CONTRASEÑA DE FORMA SEGURA")
