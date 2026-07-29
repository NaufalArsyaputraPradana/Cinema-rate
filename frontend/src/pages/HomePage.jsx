import { useState, useEffect } from 'react';
import api from '../api/axios';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaFire, FaRegStar, FaPlay, FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination for popular
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Hero state
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [trendingRes, popularRes] = await Promise.all([
          api.get('/movies/trending/'),
          api.get('/movies/popular/?page=1')
        ]);
        setTrending(trendingRes.data.results?.slice(0, 10) || []);
        
        const popResults = popularRes.data.results || [];
        setPopular(popResults);
        setHasMore(popResults.length === 20); // typical tmdb page size
      } catch (err) {
        console.error("Failed to fetch movies", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  // Auto-rotate hero movie every 8 seconds
  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(trending.length, 5));
    }, 8000);
    return () => clearInterval(interval);
  }, [trending]);

  const loadMorePopular = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await api.get(`/movies/popular/?page=${nextPage}`);
      const newResults = res.data.results || [];
      if (newResults.length === 0) {
        setHasMore(false);
      } else {
        setPopular(prev => [...prev, ...newResults]);
        setPage(nextPage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-20"><LoadingSpinner /></div>;

  const heroMovie = trending[heroIndex];
  const heroBackdrop = heroMovie?.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`
    : '';

  return (
    <div className="min-h-screen dark:bg-slate-900 bg-slate-50 pb-20">
      {/* Netflix-style Hero Section */}
      {heroMovie && (
        <div className="relative w-full h-[75vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
            <img 
              key={heroMovie.id} // forces re-render/animation
              src={heroBackdrop} 
              alt={heroMovie.title} 
              className="absolute inset-0 w-full h-full object-cover animate-pulse-slow"
              style={{ animation: 'zoomInOut 20s infinite alternate' }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl animate-fade-in-up">
                <span className="inline-block py-1 px-3 rounded-full bg-cyan-600/30 border border-cyan-500/50 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  #1 Trending Today
                </span>
                <h1 className="text-5xl md:text-7xl font-black dark:text-white text-slate-900 tracking-tight mb-4 drop-shadow-2xl">
                  {heroMovie.title}
                </h1>
                <p className="text-lg dark:text-slate-300 text-slate-600 mb-8 line-clamp-3 leading-relaxed drop-shadow-lg">
                  {heroMovie.overview}
                </p>
                <div className="flex gap-4">
                  <Link 
                    to={`/movie/${heroMovie.id}`}
                    className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 font-bold hover:bg-cyan-400 hover:text-slate-900 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:-translate-y-1"
                  >
                    <FaPlay /> View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        
        {/* Trending Section (Horizontal Scroll) */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-2">
            <FaFire className="text-2xl text-orange-500 animate-pulse" />
            <h2 className="text-2xl font-bold dark:text-white text-slate-900 tracking-tight">Trending This Week</h2>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-slate-800/50">
            {trending.map(movie => (
              <div key={movie.id} className="min-w-[160px] sm:min-w-[200px] snap-start flex-shrink-0">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>

        {/* Popular Section (Grid) */}
        <section>
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaRegStar className="text-2xl text-yellow-400" />
              <h2 className="text-2xl font-bold dark:text-white text-slate-900 tracking-tight">Discover Popular</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10">
            {popular.map((movie, idx) => (
              <MovieCard key={`${movie.id}-${idx}`} movie={movie} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-16 flex justify-center">
              <button 
                onClick={loadMorePopular}
                disabled={loadingMore}
                className="group relative flex items-center gap-3 px-8 py-4 rounded-full dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 font-bold overflow-hidden transition-all hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                {loadingMore ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <span>Load More Movies</span>
                    <FaChevronDown className="group-hover:translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}
        </section>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes zoomInOut {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
}
