from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/movies/', include('apps.movies.urls')),
    path('api/reviews/', include('apps.reviews.urls')),
    path('api/watchlist/', include('apps.watchlist.urls')),
]
