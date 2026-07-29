import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register/', formData);
      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data ? Object.values(err.response.data)[0] : 'Registration failed';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl dark:bg-slate-800 bg-white/80 p-8 shadow-2xl backdrop-blur-xl border dark:border-slate-700 border-slate-300">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tight dark:text-white text-slate-900">Create Account</h1>
          <p className="mt-2 dark:text-slate-400 text-slate-500">Join CineRate today.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium dark:text-slate-300 text-slate-600">Username</label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-slate-600 dark:bg-slate-900 bg-slate-50/50 px-4 py-3 dark:text-white text-slate-900 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              placeholder="johndoe"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-slate-300 text-slate-600">Email Address</label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-slate-600 dark:bg-slate-900 bg-slate-50/50 px-4 py-3 dark:text-white text-slate-900 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-slate-300 text-slate-600">Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-lg border border-slate-600 dark:bg-slate-900 bg-slate-50/50 px-4 py-3 dark:text-white text-slate-900 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 font-bold dark:text-white text-slate-900 shadow-lg shadow-cyan-500/30 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-70 transition-all"
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Sign Up'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm dark:text-slate-400 text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
