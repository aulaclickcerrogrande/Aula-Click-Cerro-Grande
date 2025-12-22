from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q
import cloudinary.uploader
import os

from .models import User, Course, Lesson, Enrollment, Progress, VoucherPayment, EmailVerification
from .serializers import (
    UserSerializer, UserProfileSerializer, CourseSerializer, 
    CourseDetailSerializer, LessonSerializer, LessonDetailSerializer,
    EnrollmentSerializer, ProgressSerializer, VoucherPaymentSerializer
)
from .email_utils import send_verification_email
from django.contrib.auth.hashers import make_password


class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'teacher'


class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'student'


@api_view(['POST'])
@permission_classes([AllowAny])
def send_verification_code(request):
    """
    Envía código de verificación al email del usuario
    """
    email = request.data.get('email')
    first_name = request.data.get('first_name')
    middle_name = request.data.get('middle_name', '')
    last_name = request.data.get('last_name')
    second_last_name = request.data.get('second_last_name')
    password = request.data.get('password')
    phone = request.data.get('phone', '')
    
    # Validaciones básicas
    if not all([email, first_name, last_name, second_last_name, password]):
        return Response(
            {'error': 'Todos los campos obligatorios deben estar completos.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    
    # Verificar si el email ya está registrado
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Este email ya está registrado.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar si ya existe un usuario con los mismos nombres y apellidos
    existing_user = User.objects.filter(
        first_name=first_name,
        middle_name=middle_name if middle_name else '',
        last_name=last_name,
        second_last_name=second_last_name if second_last_name != 'N/A' else ''
    ).exists()
    
    if existing_user:
        return Response(
            {'error': 'Ya existe un usuario registrado con estos nombres y apellidos. Si eres tú, intenta recuperar tu cuenta o contacta al administrador.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Generar código de verificación
    code = EmailVerification.generate_code()
    
    # Crear o actualizar registro de verificación
    verification, created = EmailVerification.objects.get_or_create(
        email=email,
        defaults={
            'code': code,
            'first_name': first_name,
            'middle_name': middle_name,
            'last_name': last_name,
            'second_last_name': second_last_name,
            'password': make_password(password),
            'phone': phone,
        }
    )
    
    if not created:
        # Actualizar datos y código
        verification.code = code
        verification.first_name = first_name
        verification.middle_name = middle_name
        verification.last_name = last_name
        verification.second_last_name = second_last_name
        verification.password = make_password(password)
        verification.phone = phone
        verification.is_verified = False
        verification.save()
    
    # Enviar email
    if send_verification_email(email, code):
        return Response({
            'message': 'Código de verificación enviado a tu email.',
            'email': email
        }, status=status.HTTP_200_OK)
    else:
        return Response(
            {'error': 'Error al enviar el email. Intenta de nuevo.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_code(request):
    """
    Reenvía código de verificación (cooldown de 60 segundos)
    """
    email = request.data.get('email')
    
    try:
        verification = EmailVerification.objects.get(email=email, is_verified=False)
    except EmailVerification.DoesNotExist:
        return Response(
            {'error': 'No se encontró una solicitud de verificación para este email.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Verificar cooldown
    if not verification.can_resend():
        return Response(
            {'error': 'Debes esperar 60 segundos antes de solicitar un nuevo código.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )
    
    # Generar nuevo código
    verification.code = EmailVerification.generate_code()
    verification.last_sent_at = timezone.now()
    verification.save()
    
    # Enviar email
    if send_verification_email(email, verification.code):
        return Response({
            'message': 'Nuevo código enviado a tu email.'
        }, status=status.HTTP_200_OK)
    else:
        return Response(
            {'error': 'Error al enviar el email. Intenta de nuevo.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_code_and_register(request):
    """
    Verifica el código y completa el registro del usuario
    """
    email = request.data.get('email')
    code = request.data.get('code')
    
    try:
        verification = EmailVerification.objects.get(email=email, is_verified=False)
    except EmailVerification.DoesNotExist:
        return Response(
            {'error': 'No se encontró una solicitud de verificación para este email.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Verificar código
    if verification.code != code:
        return Response(
            {'error': 'Código de verificación incorrecto.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Crear usuario
    try:
        # Generar username automáticamente con nombres completos
        parts = [verification.first_name]
        if verification.middle_name:
            parts.append(verification.middle_name)
        parts.append(verification.last_name)
        if verification.second_last_name and verification.second_last_name != 'N/A':
            parts.append(verification.second_last_name)
        username = " ".join(parts)
        
        user = User.objects.create(
            username=username,
            email=email,
            password=verification.password,
            first_name=verification.first_name,
            middle_name=verification.middle_name,
            last_name=verification.last_name,
            second_last_name=verification.second_last_name if verification.second_last_name != 'N/A' else '',
            phone=verification.phone,
            role='student'
        )
        
        # Marcar como verificado
        verification.is_verified = True
        verification.save()
        
        # Generar tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Error al crear el usuario: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    from django.contrib.auth import authenticate
    
    email = request.data.get('email')
    password = request.data.get('password')
    
    # Buscar usuario por email
    try:
        user_obj = User.objects.get(email=email)
        user = authenticate(username=user_obj.username, password=password)
    except User.DoesNotExist:
        user = None
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserProfileSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    
    return Response(
        {'error': 'Algo no cuadra. Revisa que tu email y contraseña estén bien escritos.'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    with open('backend_debug.log', 'a') as f:
        f.write(f"\n--- Nueva solicitud de subida: {timezone.now()} ---\n")
        
    if 'file' not in request.FILES:
        return Response({'error': 'No se envió ningún archivo'}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    # Una forma más segura de obtener datos en multipart
    file_type = request.data.get('type', 'auto')
    
    with open('backend_debug.log', 'a') as f:
        f.write(f"Archivo: {file.name}, Tipo solicitado: {file_type}\n")
    
    try:
        if file_type == 'image':
            allowed_extensions = ['.jpg', '.jpeg', '.png', '.webp']
            _, ext = os.path.splitext(file.name.lower())
            
            if ext not in allowed_extensions:
                return Response(
                    {'error': f'Extensión "{ext}" no permitida. Solo JPG, JPEG, PNG y WebP.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                result = cloudinary.uploader.upload(
                    file, 
                    folder='aula_click/images',
                    resource_type='image'
                )
                with open('backend_debug.log', 'a') as f:
                    f.write(f"Subida a Cloudinary exitosa: {result.get('secure_url')}\n")
            except Exception as e:
                with open('backend_debug.log', 'a') as f:
                    f.write(f"Error en Cloudinary: {str(e)}\n")
                return Response({'error': f'Error en Cloudinary: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        elif file_type == 'video':
            result = cloudinary.uploader.upload(file, folder='aula_click/videos', resource_type='video')
        elif file_type == 'audio':
            result = cloudinary.uploader.upload(file, folder='aula_click/audios', resource_type='video')
        else:
            result = cloudinary.uploader.upload(file, folder='aula_click/documents', resource_type='raw')
        
        return Response({
            'url': result.get('secure_url') or result.get('url'),
            'public_id': result.get('public_id')
        })
    except Exception as e:
        with open('backend_debug.log', 'a') as f:
            f.write(f"Error general en upload_file: {str(e)}\n")
        return Response({'error': f'Error en el servidor: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'teacher':
            return Course.objects.filter(teacher=user)
        return Course.objects.filter(is_published=True)
    
    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_courses(self, request):
        if request.user.role == 'teacher':
            courses = Course.objects.filter(teacher=request.user)
        else:
            enrollments = Enrollment.objects.filter(
                student=request.user,
                is_approved=True
            ).select_related('course')
            courses = [e.course for e in enrollments]
        
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsStudent])
    def enroll(self, request, pk=None):
        course = self.get_object()
        
        enrollment, created = Enrollment.objects.get_or_create(
            student=request.user,
            course=course
        )
        
        if not created:
            return Response(
                {'message': 'Ya estás inscrito en este curso'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not course.is_paid:
            enrollment.is_approved = True
            enrollment.approved_at = timezone.now()
            enrollment.save()
        
        return Response({
            'message': 'Inscripción exitosa' if not course.is_paid else 'Inscripción pendiente de pago',
            'enrollment': EnrollmentSerializer(enrollment).data
        })


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LessonDetailSerializer
        return LessonSerializer
    
    def get_queryset(self):
        course_id = self.request.query_params.get('course', None)
        if course_id:
            return Lesson.objects.filter(course_id=course_id)
        return Lesson.objects.all()
    
    @action(detail=True, methods=['post'], permission_classes=[IsStudent])
    def update_progress(self, request, pk=None):
        lesson = self.get_object()
        watched_duration = request.data.get('watched_duration', 0)
        is_completed = request.data.get('is_completed', False)
        
        try:
            enrollment = Enrollment.objects.get(
                student=request.user,
                course=lesson.course,
                is_approved=True
            )
        except Enrollment.DoesNotExist:
            return Response(
                {'error': 'No tienes acceso a este curso'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        progress, created = Progress.objects.get_or_create(
            enrollment=enrollment,
            lesson=lesson
        )
        
        progress.watched_duration = watched_duration
        progress.is_completed = is_completed
        progress.save()
        
        return Response(ProgressSerializer(progress).data)


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Enrollment.objects.filter(course__teacher=user)
        return Enrollment.objects.filter(student=user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsTeacher])
    def approve(self, request, pk=None):
        enrollment = self.get_object()
        enrollment.is_approved = True
        enrollment.approved_at = timezone.now()
        enrollment.save()
        
        return Response({
            'message': 'Inscripción aprobada',
            'enrollment': EnrollmentSerializer(enrollment).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsTeacher])
    def reject(self, request, pk=None):
        enrollment = self.get_object()
        enrollment.is_approved = False
        enrollment.approved_at = None
        enrollment.save()
        
        return Response({
            'message': 'Inscripción rechazada',
            'enrollment': EnrollmentSerializer(enrollment).data
        })


class VoucherPaymentViewSet(viewsets.ModelViewSet):
    queryset = VoucherPayment.objects.all()
    serializer_class = VoucherPaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return VoucherPayment.objects.filter(course__teacher=user)
        return VoucherPayment.objects.filter(student=user)
    
    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsTeacher])
    def approve(self, request, pk=None):
        voucher = self.get_object()
        voucher.status = 'approved'
        voucher.reviewed_at = timezone.now()
        voucher.reviewed_by = request.user
        voucher.notes = request.data.get('notes', '')
        voucher.save()
        
        enrollment, created = Enrollment.objects.get_or_create(
            student=voucher.student,
            course=voucher.course
        )
        enrollment.is_approved = True
        enrollment.approved_at = timezone.now()
        enrollment.save()
        
        return Response({
            'message': 'Voucher aprobado y estudiante inscrito',
            'voucher': VoucherPaymentSerializer(voucher).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsTeacher])
    def reject(self, request, pk=None):
        voucher = self.get_object()
        voucher.status = 'rejected'
        voucher.reviewed_at = timezone.now()
        voucher.reviewed_by = request.user
        voucher.notes = request.data.get('notes', '')
        voucher.save()
        
        return Response({
            'message': 'Voucher rechazado',
            'voucher': VoucherPaymentSerializer(voucher).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_as_seen(self, request, pk=None):
        voucher = self.get_object()
        # Solo el dueño del voucher puede marcarlo como visto
        if voucher.student != request.user:
            return Response(
                {'error': 'No tienes permiso para hacer esto.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        voucher.is_seen = True
        voucher.save()
        return Response({'message': 'Notificación marcada como vista.'})


class ProgressViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        enrollment_id = self.request.query_params.get('enrollment', None)
        
        if user.role == 'student':
            queryset = Progress.objects.filter(enrollment__student=user)
        else:
            queryset = Progress.objects.filter(enrollment__course__teacher=user)
        
        if enrollment_id:
            queryset = queryset.filter(enrollment_id=enrollment_id)
        
        return queryset


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar usuarios (solo para docentes)
    Permite listar, ver detalles, editar y eliminar estudiantes
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsTeacher]
    
    def get_queryset(self):
        """
        Filtra usuarios por rol si se proporciona el parámetro 'role'
        """
        queryset = User.objects.all()
        role = self.request.query_params.get('role', None)
        
        if role:
            queryset = queryset.filter(role=role)
        
        return queryset
    
    def destroy(self, request, *args, **kwargs):
        """
        Eliminar un usuario (solo permitido para docentes)
        """
        instance = self.get_object()
        
        # No permitir que el docente se elimine a sí mismo
        if instance.id == request.user.id:
            return Response(
                {'error': 'No puedes eliminarte a ti mismo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_destroy(instance)
        return Response(
            {'message': 'Usuario eliminado exitosamente'},
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    """
    Envía código de recuperación de contraseña al email
    """
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'error': 'El email es requerido.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar si el email existe
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'error': 'No existe una cuenta con este email.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Generar código
    from .models import PasswordReset
    code = PasswordReset.generate_code()
    
    # Crear o actualizar registro de recuperación
    PasswordReset.objects.filter(email=email, is_used=False).delete()  # Limpiar códigos anteriores
    password_reset = PasswordReset.objects.create(
        email=email,
        code=code
    )
    
    # Enviar email
    from .email_utils import send_password_reset_email
    email_sent = send_password_reset_email(email, code, user.first_name)
    
    if not email_sent:
        return Response(
            {'error': 'Error al enviar el email. Por favor, intenta de nuevo.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    return Response({
        'message': 'Código de recuperación enviado a tu email.',
        'email': email
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """
    Verifica el código y resetea la contraseña
    """
    email = request.data.get('email')
    code = request.data.get('code')
    new_password = request.data.get('new_password')
    
    if not all([email, code, new_password]):
        return Response(
            {'error': 'Email, código y nueva contraseña son requeridos.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Buscar código de recuperación
    from .models import PasswordReset
    try:
        password_reset = PasswordReset.objects.filter(
            email=email,
            code=code,
            is_used=False
        ).latest('created_at')
    except PasswordReset.DoesNotExist:
        return Response(
            {'error': 'Código inválido o ya usado.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar si el código ha expirado
    if password_reset.is_expired():
        return Response(
            {'error': 'El código ha expirado. Solicita uno nuevo.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Obtener usuario y cambiar contraseña
    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        
        # Marcar código como usado
        password_reset.is_used = True
        password_reset.save()
        
        return Response({
            'message': 'Contraseña cambiada exitosamente. Ahora puedes iniciar sesión.'
        })
    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado.'},
            status=status.HTTP_404_NOT_FOUND
        )

