import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaSearch, FaChevronDown } from 'react-icons/fa';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const searchTimeoutRef = useRef(null);

  const performSearch = async (searchQuery, pageNum = 1, append = false) => {
    if (!searchQuery.trim()) return;
    
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await api.get(`/movies/search/?query=${encodeURIComponent(searchQuery)}&page=${pageNum}`);
      const newResults = res.data.results || [];
      
      if (append) {
        setResults(prev => [...prev, ...newResults]);
      } else {
        setResults(newResults);
        setHasSearched(true);
      }
      
      setHasMore(newResults.length === 20); // if 20, likely has more
      setPage(pageNum);
      
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Debounced live search
  useEffect(() => {
    if (query !== initialQuery) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      
      searchTimeoutRef.current = setTimeout(() => {
        if (query.trim()) {
          setSearchParams({ q: query }, { replace: true });
          performSearch(query, 1, false);
        } else {
          setSearchParams({}, { replace: true });
          setResults([]);
          setHasSearched(false);
        }
      }, 600); // 600ms debounce
    }
  }, [query]);

  // Initial load from URL params
  useEffect(() => {
    if (initialQuery && !hasSearched) {
      performSearch(initialQuery, 1, false);
    }
  }, []);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      performSearch(initialQuery || query, page + 1, true);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
      <div className="mb-12 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-black dark:text-white text-slate-900 mb-6">Find Your Next Favorite Movie</h1>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative relative flex items-center">
            <FaSearch className="absolute left-6 text-xl dark:text-slate-400 text-slate-500" />
            <input
              type="text"
              className="w-full rounded-2xl border dark:border-slate-700 border-slate-300 dark:bg-slate-900 bg-slate-50 p-5 pl-16 text-xl dark:text-white text-slate-900 shadow-2xl focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              placeholder="Search by title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20"><LoadingSpinner /></div>
      ) : hasSearched ? (
        <div>
          <h2 className="mb-8 text-xl dark:text-slate-400 text-slate-500 text-center">
            Search results for <span className="font-bold dark:text-white text-slate-900 text-2xl ml-2">"{initialQuery || query}"</span>
          </h2>
          
          {results.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10">
                {results.map((movie, idx) => (
                  <MovieCard key={`${movie.id}-${idx}`} movie={movie} />
                ))}
              </div>
              
              {hasMore && (
                <div className="mt-16 flex justify-center">
                  <button 
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-3 px-8 py-3 rounded-full dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 font-bold transition-all hover:bg-slate-700 hover:border-pink-500 hover:text-pink-400 disabled:opacity-50"
                  >
                    {loadingMore ? <LoadingSpinner /> : (
                      <>
                        <span>Load More Results</span>
                        <FaChevronDown />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 dark:bg-slate-800 bg-white/20 rounded-3xl border dark:border-slate-800 border-slate-200 border-dashed max-w-2xl mx-auto">
              <FaSearch className="mx-auto text-5xl mb-4 text-slate-600" />
              <p className="text-lg dark:text-slate-400 text-slate-500">No movies found matching your query.</p>
              <p className="text-sm text-slate-500 mt-2">Try using different keywords.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-30 pointer-events-none grayscale">
          {/* Decorative empty state */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[2/3] dark:bg-slate-800 bg-white rounded-xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
          ))}
        </div>
      )}
    </div>
  );
}
