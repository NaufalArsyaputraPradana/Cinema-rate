from rest_framework import serializers
from .models import Review, ReviewLike

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    avatar = serializers.ImageField(source='user.avatar', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'username', 'avatar', 'tmdb_id', 'movie_title', 'movie_poster', 'rating', 'content', 'likes_count', 'created_at', 'updated_at']
        read_only_fields = ['user', 'likes_count']

class ReviewLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewLike
        fields = ['id', 'user', 'review', 'created_at']
        read_only_fields = ['user']
