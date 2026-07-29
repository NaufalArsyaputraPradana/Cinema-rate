import { FaHeart, FaStar, FaTrash } from 'react-icons/fa';
import api from '../api/axios';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function ReviewCard({ review, onDelete }) {
  const { isAuthenticated } = useAuthStore();
  const [likesCount, setLikesCount] = useState(review.likes_count);
  const [isLiked, setIsLiked] = useState(false); // In real app, check if current user liked it

  const handleLike = async () => {
    if (!isAuthenticated) return toast.error("Please login to like reviews");
    try {
      const res = await api.post(`/reviews/${review.id}/like/`);
      setLikesCount(res.data.likes_count);
      setIsLiked(res.data.status === 'liked');
    } catch (err) {
      toast.error("Failed to like review");
    }
  };

  return (
    <div className="rounded-xl dark:bg-slate-800 bg-white p-5 shadow-lg border dark:border-slate-700 border-slate-300/50">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-lg font-bold dark:text-white text-slate-900 shadow-inner">
            {review.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-slate-100">{review.username}</h4>
            <span className="text-xs dark:text-slate-400 text-slate-500">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 text-yellow-400">
            <FaStar />
            <span className="font-bold">{review.rating}</span>
          </div>
          {onDelete && (
            <button 
              onClick={onDelete}
              className="text-slate-500 hover:text-red-500 transition-colors p-1"
              title="Delete Review"
            >
              <FaTrash size={14} />
            </button>
          )}
        </div>
      </div>
      
      <p className="mb-4 dark:text-slate-300 text-slate-600 leading-relaxed whitespace-pre-wrap">{review.content}</p>
      
      <div className="flex items-center gap-4 border-t dark:border-slate-700 border-slate-300/50 pt-3">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm transition-colors ${
            isLiked ? 'text-pink-500' : 'dark:text-slate-400 text-slate-500 hover:text-pink-500'
          }`}
        >
          <FaHeart />
          <span>{likesCount} Likes</span>
        </button>
      </div>
    </div>
  );
}
