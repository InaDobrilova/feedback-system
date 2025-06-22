import { feedbackAPI } from '../api';
import type {
  CreateFeedbackRequest,
  UpdateFeedbackRequest,
  FeedbackCategory,
  FeedbackStatus,
  FeedbackResponse,
  Feedback
} from '../types/api';

export const fetchFeedback = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: FeedbackCategory;
  status?: FeedbackStatus;
}): Promise<FeedbackResponse> => {
  return feedbackAPI.getFeedback(params);
};

export const createFeedback = async (data: CreateFeedbackRequest): Promise<Feedback> => {
  return feedbackAPI.createFeedback(data);
};

export const updateFeedback = async (id: string, data: UpdateFeedbackRequest): Promise<Feedback> => {
  return feedbackAPI.updateFeedback(id, data);
};

export const deleteFeedback = async (id: string): Promise<void> => {
  return feedbackAPI.deleteFeedback(id);
};
