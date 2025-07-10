// @ts-check

/** @type {string} */
// @ts-ignore - This is defined by Vite at build time
const API_BASE_URL = __API_BASE_URL__;

/**
 * Gets the full API URL for an endpoint
 * @param {string} endpoint - The API endpoint (should start with /)
 * @returns {string} The full API URL
 */
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`; 