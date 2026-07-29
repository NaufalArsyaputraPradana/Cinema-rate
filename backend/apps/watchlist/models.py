from django.db import models
from django.conf import settings

class WatchlistItem(models.Model):
    STATUS_CHOICES = [
        ('want', 'Want to Watch'),
        ('watching', 'Watching'),
        ('watched', 'Watched'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='watchlist')
    tmdb_id = models.IntegerField()
    movie_title = models.CharField(max_length=255)
    movie_poster = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='want')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'tmdb_id')
        ordering = ['-added_at']
