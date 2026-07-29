import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaBookmark, FaRegCalendarAlt, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      const res = await api.get('/watchlist/');
      setWatchlist(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.delete(`/watchlist/${id}/`);
      setWatchlist(watchlist.filter(item => item.id !== id));
      toast.success("Removed from watchlist");
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      <div className="mb-10 flex items-center gap-3">
        <FaBookmark className="text-3xl text-pink-500" />
        <h1 className="text-3xl font-black dark:text-white text-slate-900 tracking-tight">Your Watchlist</h1>
      </div>

      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8">
          {watchlist.map(item => {
            const imageUrl = item.movie_poster 
              ? `${import.meta.env.VITE_TMDB_IMAGE_BASE}${item.movie_poster}`
              : 'https://via.placeholder.com/500x750?text=No+Image';

            return (
              <Link to={`/movie/${item.tmdb_id}`} key={item.id} className="group relative block overflow-hidden rounded-xl dark:bg-slate-800 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-pink-500/20">
                <div className="aspect-[2/3] w-full overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={item.movie_title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80" />
                  
                  {/* Status Tag */}
                  <div className="absolute top-3 right-3 rounded-full dark:bg-slate-900 bg-slate-50/80 px-2 py-1 text-xs font-bold text-pink-400 backdrop-blur-md border dark:border-slate-700 border-slate-300 uppercase">
                    {item.status}
                  </div>
                </div>
                
                <div className="absolute bottom-0 w-full p-4">
                  <h3 className="text-lg font-bold dark:text-white text-slate-900 line-clamp-1">{item.movie_title}</h3>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs dark:text-slate-400 text-slate-500">
                      <FaRegCalendarAlt />
                      {new Date(item.added_at).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={(e) => handleRemove(item.id, e)}
                      className="text-slate-500 hover:text-red-500 transition-colors dark:bg-slate-900 bg-slate-50/80 p-1.5 rounded-full"
                      title="Remove"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-32 dark:bg-slate-800 bg-white/30 rounded-3xl border dark:border-slate-700 border-slate-300/50">
          <FaBookmark className="mx-auto text-5xl mb-4 text-slate-600" />
          <h3 className="text-xl font-bold dark:text-slate-300 text-slate-600 mb-2">Your watchlist is empty</h3>
          <p className="text-slate-500 mb-6">Discover movies and add them to your list.</p>
          <Link to="/" className="inline-block bg-cyan-600 hover:bg-cyan-500 dark:text-white text-slate-900 font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
            Explore Movies
          </Link>
        </div>
      )}
    </div>
  );
}
