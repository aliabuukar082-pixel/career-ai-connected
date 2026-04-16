from django.urls import path
from .views import JobListView

urlpatterns = [
    # Job listing endpoint - aggregated jobs from external APIs
    path('jobs/', JobListView.as_view(), name='job_list'),
]
