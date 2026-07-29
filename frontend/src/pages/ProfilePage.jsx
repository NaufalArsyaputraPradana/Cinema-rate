import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ReviewCard from '../components/ReviewCard';
import { FaUserCircle, FaFilm, FaStar } from 'react-icons/fa';

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profRes, revRes] = await Promise.all([
          api.get(`/auth/profile/${username}/`),
          api.get(`/reviews/user/${username}/`)
        ]);
        setProfile(profRes.data);
        setReviews(revRes.data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return <LoadingSpinner />;
  if (!profile) return <div className="text-center pt-20 text-xl dark:text-slate-400 text-slate-500">User not found.</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b dark:border-slate-800 border-slate-200 pb-12 mb-12">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-5xl font-bold dark:text-white text-slate-900 shadow-xl">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl font-black dark:text-white text-slate-900 mb-2">{profile.username}</h1>
          <p className="dark:text-slate-400 text-slate-500 max-w-2xl">{profile.bio || "This user hasn't written a bio yet."}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-3xl font-bold text-cyan-400">{profile.reviews_count}</span>
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FaStar /> Reviews
              </span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-3xl font-bold text-blue-400">{profile.watchlist_count}</span>
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FaFilm /> Watchlist
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Reviews */}
      <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-6">Recent Reviews</h2>
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="dark:bg-slate-800 bg-white/30 p-6 rounded-2xl border dark:border-slate-700 border-slate-300/50">
              <h3 className="font-bold text-cyan-400 mb-2 truncate">{review.movie_title}</h3>
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 dark:bg-slate-800 bg-white/20 rounded-2xl border dark:border-slate-800 border-slate-200 border-dashed">
          <p className="text-slate-500">No reviews published yet.</p>
        </div>
      )}
    </div>
  );
}
