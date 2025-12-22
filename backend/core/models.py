from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from django.utils import timezone
import cloudinary.uploader
import random
import string


class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Estudiante'),
        ('teacher', 'Docente'),
    )
    
    middle_name = models.CharField(max_length=150, blank=True, default='')
    second_last_name = models.CharField(max_length=150, default='Pendiente')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    phone = models.CharField(max_length=50, blank=True)
    avatar = models.URLField(max_length=500, blank=True, null=True)
    yape_qr = models.URLField(max_length=500, blank=True, null=True)
    plin_qr = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def generate_username(self):
        """Genera username en formato: Primer_Nombre Inicial_Segundo_Nombre. Primer_Apellido Inicial_Segundo_Apellido."""
        parts = [self.first_name]
        if self.middle_name:
            parts.append(f"{self.middle_name[0]}.")
        parts.append(self.last_name)
        parts.append(f"{self.second_last_name[0]}.")
        return " ".join(parts)


class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = models.URLField(blank=True, null=True)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses_taught')
    is_paid = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def total_lessons(self):
        return self.lessons.count()
    
    @property
    def total_students(self):
        return self.enrollments.filter(is_approved=True).count()


class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    youtube_video_id = models.CharField(max_length=255, blank=True, null=True)
    video_duration = models.PositiveIntegerField(default=0, help_text='Duración en segundos')
    pdf_files = models.JSONField(default=list, blank=True, help_text='Lista de URLs de archivos PDF')
    docx_files = models.JSONField(default=list, blank=True, help_text='Lista de URLs de archivos DOCX')
    xlsx_files = models.JSONField(default=list, blank=True, help_text='Lista de URLs de archivos XLSX')
    pptx_files = models.JSONField(default=list, blank=True, help_text='Lista de URLs de archivos PPTX')
    audio_file = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    is_approved = models.BooleanField(default=False)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-enrolled_at']
        unique_together = ('student', 'course')
    
    def __str__(self):
        return f"{self.student.username} - {self.course.title}"
    
    @property
    def progress_percentage(self):
        total_lessons = self.course.lessons.count()
        if total_lessons == 0:
            return 0
        completed_lessons = Progress.objects.filter(
            enrollment=self,
            is_completed=True
        ).count()
        return round((completed_lessons / total_lessons) * 100, 2)


class Progress(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='progress_records')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress_records')
    watched_duration = models.PositiveIntegerField(default=0, help_text='Tiempo visto en segundos')
    is_completed = models.BooleanField(default=False)
    last_watched_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('enrollment', 'lesson')
        ordering = ['-last_watched_at']
    
    def __str__(self):
        return f"{self.enrollment.student.username} - {self.lesson.title}"


class VoucherPayment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pendiente'),
        ('approved', 'Aprobado'),
        ('rejected', 'Rechazado'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='voucher_payments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='voucher_payments')
    voucher_image = models.URLField(max_length=500)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    is_seen = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_vouchers')
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"{self.student.username} - {self.course.title} ({self.get_status_display()})"


class EmailVerification(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    last_sent_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    
    # Datos temporales del registro
    first_name = models.CharField(max_length=150)
    middle_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150)
    second_last_name = models.CharField(max_length=150)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.email} - {self.code}"
    
    @staticmethod
    def generate_code():
        return ''.join(random.choices(string.digits, k=6))
    
    def can_resend(self):
        """Verifica si han pasado 60 segundos desde el último envío"""
        if not self.last_sent_at:
            return True
        time_diff = timezone.now() - self.last_sent_at
        return time_diff.total_seconds() >= 60


class PasswordReset(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.email} - {self.code}"
    
    @staticmethod
    def generate_code():
        return ''.join(random.choices(string.digits, k=6))
    
    def is_expired(self):
        """Verifica si el código ha expirado (10 minutos)"""
        time_diff = timezone.now() - self.created_at
        return time_diff.total_seconds() > 600  # 10 minutos
