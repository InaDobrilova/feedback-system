import axios from 'axios';
import { APP_CONFIG } from '../utils/constants';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
