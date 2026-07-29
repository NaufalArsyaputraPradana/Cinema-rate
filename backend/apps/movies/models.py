from django.db import models

class Movie(models.Model):
    """Cache lokal data film dari TMDB"""
    tmdb_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    overview = models.TextField(blank=True)
    poster_path = models.CharField(max_length=255, blank=True)
    backdrop_path = models.CharField(max_length=255, blank=True)
    release_date = models.DateField(null=True, blank=True)
    vote_average = models.FloatField(default=0)
    genres = models.JSONField(default=list)  # [{id, name}]
    cached_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} (TMDB: {self.tmdb_id})"
