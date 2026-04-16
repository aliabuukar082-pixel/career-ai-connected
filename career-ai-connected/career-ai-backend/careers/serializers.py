from rest_framework import serializers
from .models import CareerQuestion, QuestionnaireAnswer, CareerRecommendation, Career, SavedCareer


class CareerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Career
        fields = ('id', 'title', 'category', 'description', 'salary_range', 
                 'growth_rate', 'required_skills', 'created_at', 'updated_at', 'is_active')
        read_only_fields = ('created_at', 'updated_at')


class SavedCareerSerializer(serializers.ModelSerializer):
    career = CareerSerializer(read_only=True)
    career_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = SavedCareer
        fields = ('id', 'career', 'career_id', 'created_at')
        read_only_fields = ('created_at',)


class CareerQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerQuestion
        fields = ('id', 'question_text', 'question_type', 'options', 'is_active', 'created_at')
        read_only_fields = ('created_at',)


class QuestionnaireAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    question_type = serializers.CharField(source='question.question_type', read_only=True)

    class Meta:
        model = QuestionnaireAnswer
        fields = ('id', 'question', 'question_text', 'question_type', 'answer', 'created_at')
        read_only_fields = ('created_at',)


class QuestionnaireSubmitSerializer(serializers.Serializer):
    answers = serializers.ListField(
        child=serializers.DictField(),
        help_text="List of answers with question_id and answer fields"
    )

    def validate(self, attrs):
        for answer in attrs['answers']:
            if 'question_id' not in answer or 'answer' not in answer:
                raise serializers.ValidationError("Each answer must contain 'question_id' and 'answer' fields")
        return attrs


class CareerRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerRecommendation
        fields = ('id', 'career_name', 'score', 'reasoning', 'created_at')
        read_only_fields = ('created_at',)
