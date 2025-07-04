import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post('/api/auth/refresh-token');
        if (res.data.token) {
          // Update token in localStorage
          localStorage.setItem('token', res.data.token);
          
          // Update axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
          originalRequest.headers['Authorization'] = `Bearer ${res.data.token}`;
          
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Clear all auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axios; 