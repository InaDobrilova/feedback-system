const getApiBaseUrl = () => {
  if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
    return '/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
};

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Dynamic Feedback Dashboard',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiBaseUrl: getApiBaseUrl(),
} as const;

export const CATEGORY_OPTIONS = ['Feature', 'Bug', 'Request'] as const;
export const STATUS_OPTIONS = ['Pending', 'Resolved', 'Closed'] as const;
