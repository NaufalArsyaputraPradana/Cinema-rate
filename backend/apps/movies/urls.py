from django.urls import path
from . import views

urlpatterns = [
    path('search/', views.SearchMovieView.as_view()),
    path('trending/', views.TrendingMovieView.as_view()),
    path('popular/', views.PopularMovieView.as_view()),
    path('<int:tmdb_id>/', views.MovieDetailView.as_view()),
]
