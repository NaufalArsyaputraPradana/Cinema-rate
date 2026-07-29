from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from . import services

class SearchMovieView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get('query', '')
        page = request.query_params.get('page', 1)
        lang = request.query_params.get('lang', 'id-ID')
        if not query:
            return Response({"error": "Query parameter is required"}, status=400)
        data = services.search_movies(query, page, lang)
        return Response(data)

class TrendingMovieView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        time_window = request.query_params.get('time_window', 'day')
        lang = request.query_params.get('lang', 'id-ID')
        data = services.get_trending(time_window, lang)
        return Response(data)

class PopularMovieView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        page = request.query_params.get('page', 1)
        lang = request.query_params.get('lang', 'id-ID')
        data = services.get_popular(page, lang)
        return Response(data)

class MovieDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, tmdb_id):
        lang = request.query_params.get('lang', 'id-ID')
        data = services.get_movie_detail(tmdb_id, lang)
        return Response(data)
