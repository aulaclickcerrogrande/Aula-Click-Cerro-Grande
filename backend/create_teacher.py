import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import User

def create_teacher():
    email = 'lpgunfv@gmail.com'
    found_user = User.objects.filter(email=email).first()
    
    if not found_user:
        user = User.objects.create_user(
            username='Luciano Perez',
            email=email,
            password='Profe.Luciano$Aula25!',
            first_name='Luciano',
            last_name='Perez',
            role='teacher'
        )
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print(f"✅ Usuario {email} creado exitosamente como profesor y admin.")
    else:
        # Asegurarse de que tenga los permisos correctos si ya existe
        found_user.role = 'teacher'
        found_user.is_staff = True
        found_user.is_superuser = True
        found_user.save()
        print(f"ℹ️ El usuario {email} ya existía, permisos actualizados.")

if __name__ == '__main__':
    create_teacher()
