from rest_framework import serializers
from .models import WatchlistItem

class WatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchlistItem
        fields = ['id', 'user', 'tmdb_id', 'movie_title', 'movie_poster', 'status', 'added_at']
        read_only_fields = ['user']
