import { useState, useEffect } from 'react';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

export default function PortfolioAd() {
  const [visible, setVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds duration

  useEffect(() => {
    // Check if we already showed it this session
    if (sessionStorage.getItem('ad_shown')) {
      setVisible(false);
      return;
    }
    
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          closeAd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const closeAd = () => {
    setVisible(false);
    sessionStorage.setItem('ad_shown', 'true');
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-500">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.5)] ring-1 ring-slate-200 dark:ring-slate-700">
        
        {/* Banner Graphic */}
        <div className="h-40 bg-gradient-to-br from-cyan-500 to-blue-600 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-3xl font-black text-white drop-shadow-md">Naufal Arsyaputra</h2>
          <p className="text-cyan-100 font-medium mt-2">Full-Stack Developer & Designer</p>
        </div>

        {/* Close Button & Timer */}
        <button 
          onClick={closeAd}
          className="absolute top-4 right-4 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 transition-colors"
        >
          <FaTimes />
        </button>
        <div className="absolute top-4 left-4 rounded-full bg-black/20 px-3 py-1 text-xs font-bold text-white shadow-inner">
          Closing in {timeLeft}s
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
            Terima kasih telah mencoba CineRate!
          </h3>
          <p className="mb-8 text-slate-600 dark:text-slate-300">
            Aplikasi ini adalah salah satu proyek portofolio saya. Jika Anda mencari web developer yang berfokus pada desain UI/UX ciamik dan sistem backend tangguh, mari berkolaborasi!
          </p>
          
          <div className="flex gap-4 justify-center">
            <button 
              onClick={closeAd}
              className="px-6 py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Tutup
            </button>
            <a 
              href="https://naufalarsyaputrapradana.github.io/other-project"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeAd}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform"
            >
              Lihat Portofolio Lain <FaExternalLinkAlt size={14} />
            </a>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700">
          <div 
            className="h-full bg-cyan-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 10) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
