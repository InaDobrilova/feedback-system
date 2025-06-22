import type { FeedbackCategory, FeedbackStatus } from "../types/api";

  export const getStatusColor = (status: FeedbackStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Resolved':
        return 'success';
      case 'Closed':
        return 'default';
      default:
        return 'default';
    }
  };

  export const getCategoryColor = (category: FeedbackCategory): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (category) {
      case 'Bug':
        return 'error';
      case 'Feature':
        return 'primary';
      case 'Request':
        return 'secondary';
      default:
        return 'default';
    }
  };