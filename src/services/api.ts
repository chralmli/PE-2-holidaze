import axios from 'axios';

const api = axios.create({
    baseURL: 'https://v2.api.noroff.dev/holidaze',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;