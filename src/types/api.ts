export const FeedbackStatusEnum = {
  Pending: 'Pending',
  Resolved: 'Resolved',
  Closed: 'Closed',
} as const;

export type FeedbackStatus = 'Pending' | 'Resolved' | 'Closed';
export type FeedbackCategory = 'Bug' | 'Feature' | 'Request';

export interface Feedback {
  id: string;
  name: string;
  email: string;
  content: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
}

export interface CreateFeedbackRequest {
  name: string;
  email: string;
  content: string;
  category?: FeedbackCategory;
  status?: FeedbackStatus;
}

export interface UpdateFeedbackRequest {
  name?: string;
  email?: string;
  content?: string;
  category?: FeedbackCategory;
  status?: FeedbackStatus;
}

export interface FeedbackResponse {
  feedback: Feedback[];
  pagination: {
    current: number;
    total: number;
    count: number;
  };
}
