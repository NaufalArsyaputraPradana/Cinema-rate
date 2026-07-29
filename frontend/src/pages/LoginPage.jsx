import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Get tokens
      const tokenRes = await api.post('/auth/login/', formData);
      const tokens = tokenRes.data;
      
      // Temporarily set token for profile fetch
      localStorage.setItem('access_token', tokens.access);
      
      // Get user profile data
      const profileRes = await api.get('/auth/profile/');
      const user = profileRes.data;
      
      // Save to store
      login(user, tokens);
      toast.success('Welcome back to CineRate!');
      navigate('/');
    } catch (err) {
      localStorage.removeItem('access_token');
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl dark:bg-slate-800 bg-white/80 p-8 shadow-2xl backdrop-blur-xl border dark:border-slate-700 border-slate-300">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tight dark:text-white text-slate-900">Welcome Back</h1>
          <p className="mt-2 dark:text-slate-400 text-slate-500">Log in to discover and rate movies.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium dark:text-slate-300 text-slate-600">Username</label>
            <input
              type="text"
              required
              className="mt-2 w-full rounded-lg border border-slate-600 dark:bg-slate-900 bg-slate-50/50 px-4 py-3 dark:text-white text-slate-900 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-slate-300 text-slate-600">Password</label>
            <input
              type="password"
              required
              className="mt-2 w-full rounded-lg border border-slate-600 dark:bg-slate-900 bg-slate-50/50 px-4 py-3 dark:text-white text-slate-900 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 font-bold dark:text-white text-slate-900 shadow-lg shadow-cyan-500/30 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-70 transition-all"
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Log In'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm dark:text-slate-400 text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-cyan-400 hover:text-cyan-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
