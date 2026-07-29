import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set) => ({
      theme: 'dark', // 'light' or 'dark'
      lang: 'id-ID', // 'id-ID' or 'en-US'
      
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setLang: (newLang) => set({ lang: newLang }),
    }),
    {
      name: 'cinerate-app-storage',
    }
  )
);

export default useAppStore;
