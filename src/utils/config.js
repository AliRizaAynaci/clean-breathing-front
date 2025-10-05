const DEFAULT_API_BASE_URL = 'https://clean-breathing-front-six.vercel.app/';

export const getApiBaseUrl = () => process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL;
