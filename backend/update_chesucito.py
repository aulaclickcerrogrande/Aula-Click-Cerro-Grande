import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import User

try:
    user = User.objects.get(email='chesucito@gmail.com')
    print(f"Usuario encontrado: {user.username}")
    
    # Actualizar con nombres completos de prueba
    user.first_name = "Jorgito"
    user.middle_name = "Antonio"
    user.last_name = "Gutierrez" 
    user.second_last_name = "Perez"
    
    # Actualizar username también
    user.username = "Jorgito Antonio Gutierrez Perez"
    
    user.save()
    
    print("\n✅ Datos actualizados correctamente:")
    print(f"Nombres: {user.first_name} {user.middle_name}")
    print(f"Apellidos: {user.last_name} {user.second_last_name}")
    print(f"Nuevo Username: {user.username}")
    
except User.DoesNotExist:
    print("❌ Usuario chesucito no encontrado")
