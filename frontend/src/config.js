export const API_BASE_URL = import.meta.env.PROD 
    ? 'https://api.chatify.kushagra-chavel.me'
    : '';

export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`; 