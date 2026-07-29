import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useAppStore from '../store/useAppStore';
import { getT } from '../utils/i18n';
import { FaSearch, FaUserCircle, FaSignOutAlt, FaBookmark, FaSun, FaMoon, FaGlobe } from 'react-icons/fa';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme, lang, setLang } = useAppStore();
  const navigate = useNavigate();
  const t = getT(lang);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLang = () => {
    setLang(lang === 'id-ID' ? 'en-US' : 'id-ID');
    // We reload the page so that all components fetch the new language data from backend
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-2xl font-black text-transparent tracking-tighter">
              {t('appName')}
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Toggles */}
            <div className="flex items-center gap-2 border-r border-slate-300 dark:border-slate-700 pr-4">
              <button 
                onClick={toggleLang}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                title="Change Language"
              >
                <FaGlobe size={14} />
                <span>{lang === 'id-ID' ? 'ID' : 'EN'}</span>
              </button>
              
              <button 
                onClick={toggleTheme}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <FaSun size={14} /> : <FaMoon size={14} />}
              </button>
            </div>

            <Link to="/search" className="text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              <FaSearch size={20} />
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4 sm:gap-5">
                <Link to="/watchlist" className="text-slate-600 dark:text-slate-300 hover:text-pink-500 transition-colors" title={t('watchlist')}>
                  <FaBookmark size={18} />
                </Link>
                <Link to={`/profile/${user?.username}`} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  <FaUserCircle size={22} />
                  <span className="hidden sm:block">{user?.username}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors"
                  title={t('logout')}
                >
                  <FaSignOutAlt size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  {t('login')}
                </Link>
                <Link to="/register" className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:bg-cyan-500 hover:shadow-cyan-500/50">
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
