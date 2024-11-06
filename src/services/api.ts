import axios from 'axios';

// Get the API key from the environment variables
const apiKey = import.meta.env.VITE_API_KEY;

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach the token to every request
api.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.accessToken) {
                config.headers.Authorization = `Bearer ${user.accessToken}`;
            }
        }

        if (apiKey) {
            config.headers['X-Noroff-API-Key'] = apiKey;
        }

        // Debugging to ensure headers are attached correctly
        console.log('Request config:', config);

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default api;