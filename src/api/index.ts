import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import type { 
  Feedback, 
  FeedbackResponse,
  CreateFeedbackRequest,
  UpdateFeedbackRequest
} from '../types/api';

export const feedbackAPI = {
  getFeedback: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  }): Promise<FeedbackResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.feedback.list, { params });
    return response.data;
  },
  
  getFeedbackItem: async (id: string): Promise<Feedback> => {
    const response = await apiClient.get(API_ENDPOINTS.feedback.getById(id));
    return response.data;
  },
  
  createFeedback: async (data: CreateFeedbackRequest): Promise<Feedback> => {
    const response = await apiClient.post(API_ENDPOINTS.feedback.create, data);
    return response.data.feedback;
  },
  
  updateFeedback: async (id: string, data: UpdateFeedbackRequest): Promise<Feedback> => {
    const response = await apiClient.put(API_ENDPOINTS.feedback.update(id), data);
    return response.data.feedback;
  },
  
  deleteFeedback: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.feedback.delete(id));
  },
};
