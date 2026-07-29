from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Review, ReviewLike
from .serializers import ReviewSerializer

class ReviewListCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        if self.request.user == serializer.instance.user:
            serializer.save()

    def perform_destroy(self, instance):
        if self.request.user == instance.user:
            instance.delete()

class LikeReviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        review = get_object_or_404(Review, pk=pk)
        like, created = ReviewLike.objects.get_or_create(user=request.user, review=review)
        if not created:
            like.delete()
            review.likes_count -= 1
            review.save()
            return Response({"status": "unliked", "likes_count": review.likes_count})
        
        review.likes_count += 1
        review.save()
        return Response({"status": "liked", "likes_count": review.likes_count})

class MovieReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        tmdb_id = self.kwargs['tmdb_id']
        return Review.objects.filter(tmdb_id=tmdb_id)

class UserReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        username = self.kwargs['username']
        return Review.objects.filter(user__username=username)
