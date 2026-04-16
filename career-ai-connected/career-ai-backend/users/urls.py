from django.urls import path
from .views import RegisterView, LoginView, ProfileView, DashboardView
from .api_views import register, register_job_provider, login, profile
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # API endpoints
    path('api/register/', register, name='api_register'),
    path('api/register/job-provider/', register_job_provider, name='api_register_job_provider'),
    path('api/login/', login, name='api_login'),
    path('api/profile/', profile, name='api_profile'),
    
    # Legacy endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    
    # JWT Token endpoints
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
