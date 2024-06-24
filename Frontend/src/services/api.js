import axios from 'axios';

axios.defaults.withCredentials = true;

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000',  // Ensure this matches your Laravel server URL
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default apiClient;