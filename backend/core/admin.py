from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Course, Lesson, Enrollment, Progress, VoucherPayment, PasswordReset


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'first_name', 'last_name', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Información Adicional', {'fields': ('role', 'phone', 'avatar')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Información Adicional', {'fields': ('role', 'phone', 'avatar')}),
    )


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'teacher', 'is_paid', 'price', 'is_published', 'total_lessons', 'total_students', 'created_at')
    list_filter = ('is_paid', 'is_published', 'created_at')
    search_fields = ('title', 'description', 'teacher__username')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'youtube_video_id', 'created_at')
    list_filter = ('course', 'created_at')
    search_fields = ('title', 'description', 'course__title')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'is_approved', 'progress_percentage', 'enrolled_at', 'approved_at')
    list_filter = ('is_approved', 'enrolled_at')
    search_fields = ('student__username', 'course__title')
    readonly_fields = ('enrolled_at', 'approved_at')


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ('enrollment', 'lesson', 'watched_duration', 'is_completed', 'last_watched_at')
    list_filter = ('is_completed', 'last_watched_at')
    search_fields = ('enrollment__student__username', 'lesson__title')
    readonly_fields = ('last_watched_at',)


@admin.register(VoucherPayment)
class VoucherPaymentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'status', 'submitted_at', 'reviewed_at', 'reviewed_by')
    list_filter = ('status', 'submitted_at', 'reviewed_at')
    search_fields = ('student__username', 'course__title')
    readonly_fields = ('submitted_at', 'reviewed_at')


@admin.register(PasswordReset)
class PasswordResetAdmin(admin.ModelAdmin):
    list_display = ('email', 'code', 'created_at', 'is_used')
    list_filter = ('is_used', 'created_at')
    search_fields = ('email',)
    readonly_fields = ('created_at',)
