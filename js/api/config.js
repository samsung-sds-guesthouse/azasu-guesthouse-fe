const API_BASE_URL = 'https://api.example.com'; // Replace with actual API URL

/**
 * A wrapper for the fetch API to handle common tasks like setting headers
 * and handling errors.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} [options={}] - The options for the fetch call.
 * @returns {Promise<any>} - The JSON response from the API.
 */
async function fetchApi(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add authorization token if available
    const token = sessionStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}