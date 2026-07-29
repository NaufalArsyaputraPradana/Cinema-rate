import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Auto-attach JWT token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  // Attach lang parameter
  const appStorage = localStorage.getItem('cinerate-app-storage');
  if (appStorage) {
    try {
      const { state } = JSON.parse(appStorage);
      if (state?.lang) {
        config.params = { ...config.params, lang: state.lang };
      }
    } catch(e) {}
  }
  
  return config;
});

// Auto-refresh token jika expired
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`, { refresh });
          localStorage.setItem('access_token', res.data.access);
          error.config.headers.Authorization = `Bearer ${res.data.access}`;
          return axios(error.config);
        } catch (e) {
          // Refresh token invalid/expired, handle logout
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
