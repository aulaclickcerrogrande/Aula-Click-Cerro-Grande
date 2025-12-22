from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Course, Lesson, Enrollment, Progress, VoucherPayment


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password2', 'first_name', 
                  'middle_name', 'last_name', 'second_last_name', 'role', 'phone', 'avatar', 'created_at')
        read_only_fields = ('id', 'username', 'created_at')
    
    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password2'):
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        
        # Generar username automáticamente
        first_name = validated_data.get('first_name', '')
        middle_name = validated_data.get('middle_name', '')
        last_name = validated_data.get('last_name', '')
        second_last_name = validated_data.get('second_last_name', '')
        
        parts = [first_name]
        if middle_name:
            parts.append(middle_name)
        parts.append(last_name)
        if second_last_name:
            parts.append(second_last_name)
        username = " ".join(parts)
        
        validated_data['username'] = username
        
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    enrolled_courses_count = serializers.SerializerMethodField()
    enrollments = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'middle_name', 'last_name', 
                  'second_last_name', 'role', 'phone', 'avatar', 'yape_qr', 'plin_qr', 'created_at', 
                  'enrolled_courses_count', 'enrollments')
        read_only_fields = ('id', 'username', 'role', 'created_at', 'enrolled_courses_count', 'enrollments')
    
    def get_enrolled_courses_count(self, obj):
        """Retorna el número de cursos a los que el estudiante está inscrito y aprobado"""
        return obj.enrollments.filter(is_approved=True).count()
    
    def get_enrollments(self, obj):
        """Retorna los enrollments con información del curso"""
        from .models import Enrollment
        enrollments = obj.enrollments.filter(is_approved=True)
        return [{
            'id': e.id,
            'course': {
                'id': e.course.id,
                'title': e.course.title,
                'is_paid': e.course.is_paid,
            },
            'is_approved': e.is_approved,
            'enrolled_at': e.enrolled_at,
        } for e in enrollments]




class LessonSerializer(serializers.ModelSerializer):
    audio_file = serializers.URLField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Lesson
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class LessonDetailSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Lesson
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def get_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                enrollment = Enrollment.objects.get(
                    student=request.user,
                    course=obj.course,
                    is_approved=True
                )
                progress = Progress.objects.filter(
                    enrollment=enrollment,
                    lesson=obj
                ).first()
                if progress:
                    return {
                        'watched_duration': progress.watched_duration,
                        'is_completed': progress.is_completed,
                        'last_watched_at': progress.last_watched_at
                    }
            except Enrollment.DoesNotExist:
                pass
        return None


class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.get_full_name', read_only=True)
    total_lessons = serializers.ReadOnlyField()
    total_students = serializers.ReadOnlyField()
    is_enrolled = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'thumbnail', 'teacher', 'teacher_name',
                  'is_paid', 'price', 'is_published', 'total_lessons', 'total_students',
                  'is_enrolled', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'teacher')
    
    def get_is_enrolled(self, obj):
        """Verifica si el usuario actual está inscrito en este curso"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(
                student=request.user,
                course=obj,
                is_approved=True
            ).exists()
        return False



class CourseDetailSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.get_full_name', read_only=True)
    teacher_phone = serializers.CharField(source='teacher.phone', read_only=True)
    teacher_yape_qr = serializers.CharField(source='teacher.yape_qr', read_only=True)
    teacher_plin_qr = serializers.CharField(source='teacher.plin_qr', read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    total_lessons = serializers.ReadOnlyField()
    total_students = serializers.ReadOnlyField()
    is_enrolled = serializers.SerializerMethodField()
    enrollment_status = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'thumbnail', 'teacher', 'teacher_name', 'teacher_phone',
                  'teacher_yape_qr', 'teacher_plin_qr',
                  'is_paid', 'price', 'is_published', 'lessons', 'total_lessons', 
                  'total_students', 'is_enrolled', 'enrollment_status', 'progress_percentage',
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'teacher', 'created_at', 'updated_at')
    
    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(student=request.user, course=obj).exists()
        return False
    
    def get_enrollment_status(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            enrollment = Enrollment.objects.filter(student=request.user, course=obj).first()
            if enrollment:
                return {
                    'is_approved': enrollment.is_approved,
                    'enrolled_at': enrollment.enrolled_at
                }
        return None
    
    def get_progress_percentage(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            enrollment = Enrollment.objects.filter(
                student=request.user, 
                course=obj, 
                is_approved=True
            ).first()
            if enrollment:
                return enrollment.progress_percentage
        return 0


class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    progress_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Enrollment
        fields = ('id', 'student', 'student_name', 'student_email', 'course', 
                  'course_title', 'is_approved', 'progress_percentage', 
                  'enrolled_at', 'approved_at')
        read_only_fields = ('id', 'enrolled_at', 'approved_at')


class ProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    
    class Meta:
        model = Progress
        fields = ('id', 'enrollment', 'lesson', 'lesson_title', 'watched_duration', 
                  'is_completed', 'last_watched_at')
        read_only_fields = ('id', 'last_watched_at')


class VoucherPaymentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    
    class Meta:
        model = VoucherPayment
        fields = ('id', 'student', 'student_name', 'student_email', 'course', 
                  'course_title', 'voucher_image', 'status', 'is_seen', 'submitted_at', 
                  'reviewed_at', 'reviewed_by', 'reviewed_by_name', 'notes')
        read_only_fields = ('id', 'student', 'submitted_at', 'reviewed_at', 'reviewed_by')
