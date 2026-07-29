from django.db import models
from django.conf import settings

class Review(models.Model):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    tmdb_id = models.IntegerField()          # ID film dari TMDB
    movie_title = models.CharField(max_length=255)
    movie_poster = models.CharField(max_length=255, blank=True)
    rating = models.IntegerField(choices=RATING_CHOICES)
    content = models.TextField()
    likes_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'tmdb_id')  # 1 user = 1 review per film
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} → {self.movie_title} ({self.rating}⭐)"

class ReviewLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'review')
