from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    send_verification_code, resend_verification_code, verify_code_and_register,
    login, get_profile, update_profile, upload_file,
    CourseViewSet, LessonViewSet, EnrollmentViewSet, 
    VoucherPaymentViewSet, ProgressViewSet, UserViewSet,
    request_password_reset, reset_password
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'vouchers', VoucherPaymentViewSet)
router.register(r'progress', ProgressViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('auth/send-code/', send_verification_code, name='send_verification_code'),
    path('auth/resend-code/', resend_verification_code, name='resend_verification_code'),
    path('auth/verify-register/', verify_code_and_register, name='verify_code_and_register'),
    path('auth/login/', login, name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', get_profile, name='get_profile'),
    path('auth/profile/update/', update_profile, name='update_profile'),
    path('auth/password-reset/request/', request_password_reset, name='request_password_reset'),
    path('auth/password-reset/confirm/', reset_password, name='reset_password'),
    path('upload/', upload_file, name='upload_file'),
    path('', include(router.urls)),
]
