// @ts-check

/** @type {string} */
// @ts-ignore - Vite's import.meta.env is not recognized by TypeScript
const BASE_URL = import.meta.env.PROD 
    ? 'https://api.chatify.kushagra-chavel.me'
    : '';

/**
 * Gets the full API URL for an endpoint
 * @param {string} endpoint - The API endpoint (should start with /)
 * @returns {string} The full API URL
 */
export const getApiUrl = (endpoint) => `${BASE_URL}${endpoint}`; 