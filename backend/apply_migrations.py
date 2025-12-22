import os
import sys

# Agregar el directorio backend al path
backend_path = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_path)

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

from django.core.management import call_command

print("=" * 60)
print("Aplicando migraciones para PasswordReset...")
print("=" * 60)

try:
    call_command('migrate')
    print("\n✅ Migraciones aplicadas exitosamente!")
    print("\nEl sistema de recuperación de contraseña está ahora activo.")
except Exception as e:
    print(f"\n❌ Error al aplicar migraciones: {e}")
    sys.exit(1)
