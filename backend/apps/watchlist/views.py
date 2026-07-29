from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import WatchlistItem
from .serializers import WatchlistSerializer

class WatchlistView(generics.ListCreateAPIView):
    serializer_class = WatchlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WatchlistItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WatchlistItemView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WatchlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WatchlistItem.objects.filter(user=self.request.user)

class CheckWatchlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, tmdb_id):
        item = WatchlistItem.objects.filter(user=request.user, tmdb_id=tmdb_id).first()
        if item:
            return Response({"in_watchlist": True, "status": item.status, "id": item.id})
        return Response({"in_watchlist": False})
