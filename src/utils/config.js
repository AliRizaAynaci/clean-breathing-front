const DEFAULT_API_BASE_URL = 'http://localhost:8080';

export const getApiBaseUrl = () => process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL;
