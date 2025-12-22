import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import EmailVerification

ev = EmailVerification.objects.filter(is_verified=False).order_by('-created_at').first()

if ev:
    print(f"\n{'='*60}")
    print("🔐 CÓDIGO DE VERIFICACIÓN")
    print(f"{'='*60}")
    print(f"Email: {ev.email}")
    print(f"Código: {ev.code}")
    print(f"{'='*60}\n")
else:
    print("No hay códigos de verificación pendientes")
