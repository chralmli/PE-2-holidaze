import axios from 'axios';



/** API key from environment variables */
const apiKey = import.meta.env.VITE_API_KEY;

/**
 * Axios instance configured with base URL and default headers
 * @constant
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Noroff-API-Key': apiKey,
    },
});

/**
 * Request interceptor to attach authentication tokens
 * Adds Bearer token from localStorage if user is logged in
 * Adds API key from environment variables if available
 */
api.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');

    if (storedUser && storedToken) {
            const user = JSON.parse(storedUser);
            if (user.accessToken) {
                config.headers.Authorization = `Bearer ${storedToken}`;
            }
        }

        if (apiKey) {
            config.headers['X-Noroff-API-Key'] = apiKey;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor to handle authentication errors
 * Redirects to login page and clears user data on 401 responses
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)

export default api;