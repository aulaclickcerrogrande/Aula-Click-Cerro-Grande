import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import User, EmailVerification

email_to_delete = 'chesucito@gmail.com'

try:
    # Eliminar verificaciones de email pendientes o pasadas
    verifications = EmailVerification.objects.filter(email=email_to_delete)
    count_verif = verifications.count()
    verifications.delete()
    print(f"🗑️ Se eliminaron {count_verif} registros de verificación de email.")

    # Eliminar el usuario
    user = User.objects.get(email=email_to_delete)
    username = user.username
    user.delete()
    
    print("\n" + "="*60)
    print(f"✅ Usuario eliminado exitosamente:")
    print(f"Email: {email_to_delete}")
    print(f"Username: {username}")
    print("="*60 + "\n")
    
except User.DoesNotExist:
    print(f"\n❌ El usuario {email_to_delete} no existe en la base de datos.")
except Exception as e:
    print(f"\n❌ Error al eliminar usuario: {str(e)}")
