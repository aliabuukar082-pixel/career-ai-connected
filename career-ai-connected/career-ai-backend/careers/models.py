from django.db import models
from django.contrib.auth.models import User


class Career(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    description = models.TextField()
    salary_range = models.CharField(max_length=100, help_text="e.g., '$60,000 - $80,000'")
    growth_rate = models.CharField(max_length=50, help_text="e.g., '15% (Much faster than average)'")
    required_skills = models.JSONField(default=list, blank=True, help_text="List of required skills")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return f"{self.title} - {self.category}"


class SavedCareer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    career = models.ForeignKey(Career, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'career']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.career.title}"


class CareerQuestion(models.Model):
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=[
        ('single_choice', 'Single Choice'),
        ('multiple_choice', 'Multiple Choice'),
        ('text', 'Text'),
        ('scale', 'Scale (1-10)'),
    ])
    options = models.JSONField(default=dict, blank=True, help_text="JSON object with options for choice questions")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Question {self.id}: {self.question_text[:50]}..."


class QuestionnaireAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(CareerQuestion, on_delete=models.CASCADE)
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'question']

    def __str__(self):
        return f"{self.user.username} - Question {self.question.id}"


class CareerRecommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    career_name = models.CharField(max_length=200)
    score = models.FloatField(help_text="Recommendation score from 0 to 100")
    reasoning = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score']

    def __str__(self):
        return f"{self.user.username} - {self.career_name} ({self.score}%)"
