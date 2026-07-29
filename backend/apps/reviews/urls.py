from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReviewListCreateView.as_view()),
    path('<int:pk>/', views.ReviewDetailView.as_view()),
    path('<int:pk>/like/', views.LikeReviewView.as_view()),
    path('movie/<int:tmdb_id>/', views.MovieReviewsView.as_view()),
    path('user/<str:username>/', views.UserReviewsView.as_view()),
]
