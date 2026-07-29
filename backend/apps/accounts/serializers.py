from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'bio', 'avatar']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserProfileSerializer(serializers.ModelSerializer):
    reviews_count = serializers.SerializerMethodField()
    watchlist_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio', 'avatar', 'reviews_count', 'watchlist_count', 'date_joined']
        read_only_fields = ['date_joined']

    def get_reviews_count(self, obj):
        return obj.reviews.count()

    def get_watchlist_count(self, obj):
        return obj.watchlist.count()
