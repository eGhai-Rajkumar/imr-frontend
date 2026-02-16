// src/common/api/api.jsx

// Global X-API-KEY Declaration (Only place the key is hardcoded)
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M"; 

const BASE_URL = "https://api.yaadigo.com";

// --- Custom Fetch Client ---
const secureFetch = async (url, config = {}) => {
    // ... (rest of the URL assembly logic)

    // THE KEY IS ADDED HERE:
    const headers = {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'x-api-key': API_KEY, // <--- Key automatically injected here
        ...config.headers, // Merges any custom headers, but ours is already set
    };
    
    // ... (rest of the fetch logic)
};

export const APIBaseUrl = {
    // These methods automatically call secureFetch, which inserts the API_KEY.
    get: (url, config) => secureFetch(url, { ...config, method: 'GET' }),
    post: (url, data, config) => secureFetch(url, { ...config, method: 'POST', data }),
    // ... (put, delete methods)
};