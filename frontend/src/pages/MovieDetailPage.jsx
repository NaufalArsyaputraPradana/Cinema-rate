import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import toast from 'react-hot-toast';
import { FaBookmark, FaRegBookmark, FaCalendarAlt, FaClock, FaStar, FaPlay, FaTimes } from 'react-icons/fa';
import useAppStore from '../store/useAppStore';
import { getT } from '../utils/i18n';

export default function MovieDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const { lang } = useAppStore();
  const t = getT(lang);
  
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [watchlistStatus, setWatchlistStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Review form state
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Trailer state
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieRes = await api.get(`/movies/${id}/`);
        setMovie(movieRes.data);
        
        const reviewsRes = await api.get(`/reviews/movie/${id}/`);
        setReviews(reviewsRes.data.results || []);
        
        if (isAuthenticated) {
          const wlRes = await api.get(`/watchlist/check/${id}/`);
          if (wlRes.data.in_watchlist) {
            setWatchlistStatus(wlRes.data);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isAuthenticated]);

  const toggleWatchlist = async () => {
    if (!isAuthenticated) return toast.error("Please login to use watchlist");
    try {
      if (watchlistStatus) {
        await api.delete(`/watchlist/${watchlistStatus.id}/`);
        setWatchlistStatus(null);
        toast.success("Removed from watchlist");
      } else {
        const payload = {
          tmdb_id: movie.id,
          movie_title: movie.title,
          movie_poster: movie.poster_path || '',
          status: 'want'
        };
        const res = await api.post('/watchlist/', payload);
        setWatchlistStatus(res.data);
        toast.success("Added to watchlist");
      }
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a rating");
    if (!content.trim()) return toast.error("Review content cannot be empty");
    
    setSubmittingReview(true);
    try {
      const payload = {
        tmdb_id: movie.id,
        movie_title: movie.title,
        movie_poster: movie.poster_path || '',
        rating,
        content
      };
      const res = await api.post('/reviews/', payload);
      setReviews([res.data, ...reviews]);
      setRating(0);
      setContent('');
      toast.success("Review posted successfully!");
    } catch (err) {
      const msg = err.response?.data ? Object.values(err.response.data)[0] : "Failed to post review";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/${reviewId}/`);
      setReviews(reviews.filter(r => r.id !== reviewId));
      toast.success("Review deleted");
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  if (loading) return <div className="min-h-screen pt-20"><LoadingSpinner /></div>;
  if (!movie) return <div className="text-center pt-20 text-xl">Movie not found</div>;

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '';
  const posterUrl = movie.poster_path
    ? `${import.meta.env.VITE_TMDB_IMAGE_BASE}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';

  // Get trailer
  const trailer = movie.videos?.results?.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer');

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <button 
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-3 dark:text-white text-slate-900 hover:bg-red-500 transition-colors"
            >
              <FaTimes size={20} />
            </button>
            <iframe 
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`} 
              title="Trailer" 
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] min-h-[400px]">
        {backdropUrl && (
          <img src={backdropUrl} alt="Backdrop" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 w-full flex flex-col md:flex-row gap-8 items-end md:items-stretch">
            {/* Poster */}
            <div className="w-40 md:w-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl border-2 dark:border-slate-700 border-slate-300/50 shadow-cyan-900/20 md:-mb-24 z-10 hidden sm:block">
              <img src={posterUrl} alt={movie.title} className="w-full h-auto object-cover" />
            </div>
            
            {/* Info */}
            <div className="flex-1 pb-4">
              <h1 className="text-4xl md:text-5xl font-black dark:text-white text-slate-900 tracking-tight mb-2">
                {movie.title} <span className="dark:text-slate-400 text-slate-500 font-light">({year})</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium dark:text-slate-300 text-slate-600 mb-6">
                <div className="flex items-center gap-1.5 px-3 py-1 dark:bg-slate-800 bg-white/80 rounded-full backdrop-blur-sm border dark:border-slate-700 border-slate-300">
                  <FaStar className="text-yellow-400" />
                  <span className="dark:text-white text-slate-900">{movie.vote_average?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 dark:bg-slate-800 bg-white/80 rounded-full backdrop-blur-sm border dark:border-slate-700 border-slate-300">
                  <FaCalendarAlt />
                  <span>{movie.release_date}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 dark:bg-slate-800 bg-white/80 rounded-full backdrop-blur-sm border dark:border-slate-700 border-slate-300">
                  <FaClock />
                  <span>{runtime}</span>
                </div>
                {movie.genres?.map(g => (
                  <span key={g.id} className="px-3 py-1 dark:bg-slate-800 bg-white/80 rounded-full backdrop-blur-sm border dark:border-slate-700 border-slate-300">
                    {g.name}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={toggleWatchlist}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
                    watchlistStatus 
                      ? 'bg-slate-700 dark:text-white text-slate-900 hover:bg-slate-600' 
                      : 'bg-cyan-600 dark:text-white text-slate-900 hover:bg-cyan-500 shadow-cyan-500/30'
                  }`}
                >
                  {watchlistStatus ? <FaBookmark /> : <FaRegBookmark />}
                  {watchlistStatus ? t('inWatchlist') : t('addWatchlist')}
                </button>
                
                {trailer && (
                  <button 
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold dark:text-white text-slate-900 dark:bg-slate-800 bg-white/80 hover:bg-slate-700 backdrop-blur-sm border border-slate-600 transition-all hover:scale-105"
                  >
                    <FaPlay className="text-pink-500" />
                    {t('playTrailer')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">{t('overview')}</h2>
              <p className="dark:text-slate-300 text-slate-600 text-lg leading-relaxed">{movie.overview || "No overview available."}</p>
            </section>

            {/* Cast Carousel */}
            {movie.credits?.cast?.length > 0 && (
              <section className="pt-4 border-t dark:border-slate-800 border-slate-200">
                <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-6">{t('cast')}</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
                  {movie.credits.cast.slice(0, 10).map(actor => (
                    <div key={actor.id} className="min-w-[140px] w-[140px] dark:bg-slate-800 bg-white rounded-xl overflow-hidden shadow-lg snap-start flex-shrink-0">
                      <div className="aspect-[2/3] w-full dark:bg-slate-900 bg-slate-50">
                        {actor.profile_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                            alt={actor.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-700">No Image</div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-sm dark:text-white text-slate-900 line-clamp-1">{actor.name}</h4>
                        <p className="text-xs dark:text-slate-400 text-slate-500 line-clamp-2 mt-1">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="border-t dark:border-slate-800 border-slate-200 pt-12">
              <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-8 flex items-center gap-2">
                {t('reviews')} <span className="dark:bg-slate-800 bg-white text-sm py-1 px-3 rounded-full">{reviews.length}</span>
              </h2>
              
              {/* Write Review Form */}
              {isAuthenticated ? (
                <form onSubmit={submitReview} className="dark:bg-slate-800 bg-white/50 p-6 rounded-2xl border dark:border-slate-700 border-slate-300 mb-8 backdrop-blur-sm">
                  <h3 className="font-semibold dark:text-white text-slate-900 mb-4">{t('writeReview')}</h3>
                  <div className="mb-4">
                    <StarRating rating={rating} setRating={setRating} />
                  </div>
                  <textarea
                    rows="3"
                    className="w-full dark:bg-slate-900 bg-slate-50/80 border dark:border-slate-700 border-slate-300 rounded-xl p-4 dark:text-white text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none transition-all"
                    placeholder="What did you think of the movie?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                  <div className="mt-4 flex justify-end">
                    <button 
                      type="submit"
                      disabled={submittingReview}
                      className="bg-cyan-600 hover:bg-cyan-500 dark:text-white text-slate-900 font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                    >
                      {submittingReview ? t('posting') : t('postReview')}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="dark:bg-slate-800 bg-white/50 p-6 rounded-2xl border dark:border-slate-700 border-slate-300 mb-8 text-center backdrop-blur-sm">
                  <p className="dark:text-slate-300 text-slate-600">Log in to share your thoughts on this movie.</p>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map(review => (
                  <ReviewCard 
                    key={review.id} 
                    review={review} 
                    onDelete={isAuthenticated && user?.username === review.username ? () => handleDeleteReview(review.id) : null}
                  />
                ))}
                {reviews.length === 0 && (
                  <p className="text-slate-500 text-center py-8 italic">No reviews yet. Be the first!</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="dark:bg-slate-800 bg-white/50 rounded-2xl p-6 border dark:border-slate-700 border-slate-300 backdrop-blur-sm">
              <h3 className="font-bold dark:text-white text-slate-900 mb-4">{t('details')}</h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500">{t('status')}</dt>
                  <dd className="text-slate-200 font-medium">{movie.status}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">{t('language')}</dt>
                  <dd className="text-slate-200 font-medium uppercase">{movie.original_language}</dd>
                </div>
                {movie.budget > 0 && (
                  <div>
                    <dt className="text-slate-500">{t('budget')}</dt>
                    <dd className="text-slate-200 font-medium">${movie.budget.toLocaleString()}</dd>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <dt className="text-slate-500">{t('revenue')}</dt>
                    <dd className="text-slate-200 font-medium">${movie.revenue.toLocaleString()}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
