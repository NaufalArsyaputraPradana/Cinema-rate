from django.urls import path
from . import views

urlpatterns = [
    path('', views.WatchlistView.as_view()),
    path('<int:pk>/', views.WatchlistItemView.as_view()),
    path('check/<int:tmdb_id>/', views.CheckWatchlistView.as_view()),
]
