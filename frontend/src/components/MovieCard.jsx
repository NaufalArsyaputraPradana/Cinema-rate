import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

export default function MovieCard({ movie }) {
  const imageUrl = movie.poster_path 
    ? `${import.meta.env.VITE_TMDB_IMAGE_BASE}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  return (
    <Link to={`/movie/${movie.id || movie.tmdb_id}`} className="group relative block overflow-hidden rounded-xl dark:bg-slate-800 bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-cyan-500/20">
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={movie.title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80" />
      </div>
      <div className="absolute bottom-0 w-full p-4">
        <h3 className="text-lg font-bold dark:text-white text-slate-900 line-clamp-1">{movie.title}</h3>
        <div className="mt-1 flex items-center justify-between text-sm dark:text-slate-300 text-slate-600">
          <span>{year}</span>
          <div className="flex items-center gap-1 font-semibold text-yellow-400">
            <FaStar />
            <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
