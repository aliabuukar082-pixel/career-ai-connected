from django.urls import path
from .views import (
    CareerQuestionsView, 
    QuestionnaireAnswerView, 
    CareerListView,
    CareerDetailView,
    SavedCareerListView,
    SaveCareerView,
    UnsaveCareerView
)

urlpatterns = [
    path('career_questions/', CareerQuestionsView.as_view(), name='career_questions'),
    path('questionnaire/answer/', QuestionnaireAnswerView.as_view(), name='questionnaire_answer'),
    
    # Career Library endpoints
    path('careers/', CareerListView.as_view(), name='career_list'),
    path('careers/<int:pk>/', CareerDetailView.as_view(), name='career_detail'),
    
    # Saved Careers endpoints
    path('saved_careers/', SavedCareerListView.as_view(), name='saved_career_list'),
    path('saved_careers/save/', SaveCareerView.as_view(), name='save_career'),
    path('saved_careers/<int:id>/', UnsaveCareerView.as_view(), name='unsave_career'),
]
