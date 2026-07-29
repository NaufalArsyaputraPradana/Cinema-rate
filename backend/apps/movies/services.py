import requests
from django.conf import settings

BASE_URL = settings.TMDB_BASE_URL
API_KEY = settings.TMDB_API_KEY

HEADERS = {
    "accept": "application/json",
    "Authorization": f"Bearer {settings.TMDB_API_KEY}"  # gunakan API Read Token jika mau
}

def search_movies(query, page=1, lang="id-ID"):
    url = f"{BASE_URL}/search/movie"
    params = {"api_key": API_KEY, "query": query, "page": page, "language": lang}
    response = requests.get(url, params=params)
    return response.json()

def get_trending(time_window="day", lang="id-ID"):
    url = f"{BASE_URL}/trending/movie/{time_window}"
    params = {"api_key": API_KEY, "language": lang}
    response = requests.get(url, params=params)
    return response.json()

def get_movie_detail(tmdb_id, lang="id-ID"):
    url = f"{BASE_URL}/movie/{tmdb_id}"
    params = {"api_key": API_KEY, "language": lang, "append_to_response": "credits,videos"}
    response = requests.get(url, params=params)
    return response.json()

def get_popular(page=1, lang="id-ID"):
    url = f"{BASE_URL}/movie/popular"
    params = {"api_key": API_KEY, "language": lang, "page": page}
    response = requests.get(url, params=params)
    return response.json()
