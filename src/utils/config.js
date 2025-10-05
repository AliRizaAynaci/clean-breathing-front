const DEFAULT_API_BASE_URL = 'https://clean-breathing-710737072c4d.herokuapp.com';


export const getApiBaseUrl = () => process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL;
