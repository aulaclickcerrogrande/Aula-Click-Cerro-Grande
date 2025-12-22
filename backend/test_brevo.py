import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.email_utils import send_verification_email

# Prueba de envío de email
print("\n" + "="*60)
print("🧪 PROBANDO ENVÍO DE EMAIL CON BREVO")
print("="*60)

test_email = input("Ingresa tu email para probar: ")
test_code = "123456"

print(f"\nEnviando email a: {test_email}")
print(f"Código de prueba: {test_code}\n")

result = send_verification_email(test_email, test_code)

if result:
    print("\n✅ Email enviado exitosamente!")
    print("Revisa tu bandeja de entrada (y spam).\n")
else:
    print("\n❌ Error al enviar email.")
    print("Verifica tu API key de Brevo y que el remitente esté verificado.\n")

print("="*60 + "\n")
