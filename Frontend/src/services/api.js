import axios from 'axios';

axios.defaults.withCredentials = true;

const apiClient = axios.create({
  baseURL: 'https://invite-system-backend.up.railway.app', // Update with your Railway backend URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add a request interceptor
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default apiClient;
