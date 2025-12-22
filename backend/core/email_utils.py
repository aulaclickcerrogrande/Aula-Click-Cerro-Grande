import os
from sib_api_v3_sdk import Configuration, ApiClient, TransactionalEmailsApi, SendSmtpEmail

def send_verification_email(email, code):
    """
    Envía un email con el código de verificación usando Brevo
    En modo desarrollo (sin BREVO_API_KEY), imprime el código en consola
    """
    brevo_api_key = os.getenv('BREVO_API_KEY')
    
    # Modo desarrollo: si no hay API key, imprimir en consola
    if not brevo_api_key:
        print("\n" + "="*60)
        print("🔐 CÓDIGO DE VERIFICACIÓN (MODO DESARROLLO)")
        print("="*60)
        print(f"Email: {email}")
        print(f"Código: {code}")
        print("="*60 + "\n")
        return True
    
    # Modo producción: enviar email con Brevo
    configuration = Configuration()
    configuration.api_key['api-key'] = brevo_api_key
    
    api_instance = TransactionalEmailsApi(ApiClient(configuration))
    
    send_smtp_email = SendSmtpEmail(
        to=[{"email": email}],
        sender={"email": "aulaclickcerrogrande@gmail.com", "name": "Aula Click Cerro Grande"},
        subject="Código de verificación - Aula Click",
        html_content=f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; text-align: center;">Aula Click Cerro Grande</h1>
            </div>
            <div style="background: #f7fafc; padding: 40px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #2d3748; margin-bottom: 20px;">¡Bienvenido a Aula Click!</h2>
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                    Gracias por registrarte en nuestra plataforma educativa. Para completar tu registro, 
                    utiliza el siguiente código de verificación:
                </p>
                <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                    <p style="color: #718096; margin: 0 0 10px 0; font-size: 14px;">Tu código de verificación es:</p>
                    <h1 style="color: #667eea; font-size: 48px; letter-spacing: 8px; margin: 0; font-weight: bold;">{code}</h1>
                </div>
                <p style="color: #4a5568; font-size: 14px; line-height: 1.6;">
                    <strong>Importante:</strong> Este código no expira, pero solo puedes solicitar un nuevo código 
                    después de 60 segundos.
                </p>
                <p style="color: #718096; font-size: 13px; margin-top: 30px;">
                    Si no solicitaste este registro, puedes ignorar este correo.
                </p>
            </div>
            <div style="text-align: center; padding: 20px; color: #a0aec0; font-size: 12px;">
                <p>© 2024 Aula Click Cerro Grande. Todos los derechos reservados.</p>
            </div>
        </body>
        </html>
        """
    )
    
    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        return True
    except Exception as e:
        print(f"Error al enviar email: {e}")
        return False


def send_password_reset_email(email, code, first_name):
    """
    Envía un email con el código de recuperación de contraseña usando Brevo
    """
    brevo_api_key = os.getenv('BREVO_API_KEY')
    
    # Modo desarrollo: si no hay API key, imprimir en consola
    if not brevo_api_key:
        print("\n" + "="*60)
        print("🔑 CÓDIGO DE RECUPERACIÓN (MODO DESARROLLO)")
        print("="*60)
        print(f"Email: {email}")
        print(f"Código: {code}")
        print("="*60 + "\n")
        return True
    
    # Modo producción: enviar email con Brevo
    configuration = Configuration()
    configuration.api_key['api-key'] = brevo_api_key
    
    api_instance = TransactionalEmailsApi(ApiClient(configuration))
    
    send_smtp_email = SendSmtpEmail(
        to=[{"email": email}],
        sender={"email": "aulaclickcerrogrande@gmail.com", "name": "Aula Click Cerro Grande"},
        subject="Recuperación de contraseña - Aula Click",
        html_content=f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; text-align: center;">Aula Click Cerro Grande</h1>
            </div>
            <div style="background: #f7fafc; padding: 40px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #2d3748; margin-bottom: 20px;">Hola {first_name},</h2>
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                    Recibimos una solicitud para recuperar tu contraseña. Si fuiste tú, 
                    utiliza el siguiente código para restablecer tu contraseña:
                </p>
                <div style="background: white; border: 2px solid #f5576c; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                    <p style="color: #718096; margin: 0 0 10px 0; font-size: 14px;">Tu código de recuperación es:</p>
                    <h1 style="color: #f5576c; font-size: 48px; letter-spacing: 8px; margin: 0; font-weight: bold;">{code}</h1>
                </div>
                <p style="color: #4a5568; font-size: 14px; line-height: 1.6;">
                    <strong>Importante:</strong> Este código expirará en 10 minutos por seguridad.
                </p>
                <p style="color: #e53e3e; font-size: 14px; font-weight: bold; margin-top: 20px;">
                    Si no solicitaste recuperar tu contraseña, ignora este correo y tu cuenta permanecerá segura.
                </p>
            </div>
            <div style="text-align: center; padding: 20px; color: #a0aec0; font-size: 12px;">
                <p>© 2024 Aula Click Cerro Grande. Todos los derechos reservados.</p>
            </div>
        </body>
        </html>
        """
    )
    
    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        return True
    except Exception as e:
        print(f"Error al enviar email: {e}")
        return False
